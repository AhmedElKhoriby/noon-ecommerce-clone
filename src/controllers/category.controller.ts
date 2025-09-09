import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { processCategoryImage, deleteImage, cleanupFailedUpload } from '../services/imageProcessing.service';
import { uploadSingleImage } from '../middlewares/upload.middleware';
import * as categoryService from '../services/category.service';
import AppError from '../errors/appError';
import {
  IGetCategoriesRequest,
  IGetCategoryRequest,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
  IDeleteCategoryRequest,
} from '../types/category.request.type';

// Upload middleware
export const uploadCategoryImage = uploadSingleImage('image');

// Image processing middleware
export const resizeImage = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.file && req.method === 'PATCH') {
    return next();
  }

  if (!req.file) {
    throw AppError.custom(400, 'No image file found in request, please upload an image');
  }

  const result = await processCategoryImage(req.file.buffer);

  req.body.image = result.cloudUrl || result.filename;
  req.body.imageCloudId = result.cloudPublicId;
  req.body.imageLocalPath = result.localPath;

  next();
});

/**
 * @desc    Get all categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
export const getCategories = catchAsync(async (req: IGetCategoriesRequest, res: Response): Promise<void> => {
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;
  const skip = (page - 1) * limit;

  const categories = await categoryService.getCategories(limit, skip);

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
});

/**
 * @desc    Get single category
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
export const getCategory = catchAsync(async (req: IGetCategoryRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const category = await categoryService.getCategory(id);
  if (!category) {
    throw AppError.custom(404, `No category found with id: ${id}`);
  }

  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

/**
 * @desc    Create new category
 * @route   POST /api/v1/categories
 * @access  Private/Admin
 */
export const createCategory = catchAsync(async (req: ICreateCategoryRequest, res: Response): Promise<void> => {
  const categoryData = req.body;
  const imageCloudId = req.body.imageCloudId;
  const imageLocalPath = req.body.imageLocalPath;

  try {
    const newCategory = await categoryService.createCategory(categoryData);

    res.status(201).json({
      status: 'success',
      data: { category: newCategory },
    });
  } catch (error) {
    // Cleanup images if database operation failed
    if (imageCloudId || imageLocalPath) {
      cleanupFailedUpload(imageCloudId, imageLocalPath);
    }
    throw error; // Re-throw to be handled by catchAsync
  }
});

/**
 * @desc    Update category
 * @route   PATCH /api/v1/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = catchAsync(async (req: IUpdateCategoryRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  const newImageCloudId = req.body.imageCloudId;
  const newImageLocalPath = req.body.imageLocalPath;

  try {
    // Get existing category first
    const existingCategory = await categoryService.getCategory(id);
    if (!existingCategory) {
      throw AppError.custom(404, `No category found with id: ${id}`);
    }

    const updatedCategory = await categoryService.updateCategory(id, updateData);

    // Delete old image if new one was uploaded successfully
    if (req.file && newImageCloudId && existingCategory.imageCloudId) {
      // Delete old image asynchronously (don't wait)
      deleteImage(existingCategory.imageCloudId).catch((error) => {
        console.error('Failed to delete old category image:', error);
      });
    }

    res.status(200).json({
      status: 'success',
      data: { category: updatedCategory },
    });
  } catch (error) {
    // Cleanup new image if database operation failed
    if (req.file && (newImageCloudId || newImageLocalPath)) {
      cleanupFailedUpload(newImageCloudId, newImageLocalPath);
    }
    throw error; // Re-throw to be handled by catchAsync
  }
});

/**
 * @desc    Delete category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = catchAsync(async (req: IDeleteCategoryRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  // Get category first to access image data
  const category = await categoryService.getCategory(id);
  if (!category) {
    throw AppError.custom(404, `No category found with id: ${id}`);
  }

  await categoryService.deleteCategory(id);

  // Delete associated image asynchronously (don't wait for response)
  if (category.imageCloudId) {
    deleteImage(category.imageCloudId).catch((error) => {
      console.error('Failed to delete category image:', error);
    });
  }

  res.status(204).send();
});
