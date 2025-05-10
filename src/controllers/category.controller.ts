import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { catchAsync } from './../utils/catchAsync';
import * as categoryService from '../services/category.service';

import {
  IGetCategoriesRequest,
  IGetCategoryRequest,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
  IDeleteCategoryRequest,
} from '../types/category.request.type';
import AppError from '../errors/appError';

import multer from 'multer';
import path from 'path';
import { uploadSingleImage } from '../middlewares/uploadImage.middleware';
/**

{
  fieldname: 'image',
  originalname: 'photo_2022-09-22_10-44-43.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'src/uploads/products',
  filename: 'f9d7e17193f526e40d00d88a81e63884',
  path: 'src\\uploads\\products\\f9d7e17193f526e40d00d88a81e63884',
  size: 80080
}

 */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/categories');
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `category-${uuidv4()}${Date.now()}.${ext}`);
//   },
// });

export const uploadCategoryImage = uploadSingleImage('image');

export const resizeImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(AppError.custom(400, 'Please upload an image'));
  }

  const filename = `category-${uuidv4()}${Date.now()}.jpeg`;
  const outputPath = `uploads/categories/${filename}`;

  await sharp(req.file.buffer).toFormat('jpeg').jpeg({ quality: 90 }).toFile(outputPath);

  req.body.image = filename;

  next();
});

/**
 *   @method GET
 *   @route ~/api/v1/categories
 *   @desc Get list of categories
 *   @access public
 */
export const getCategories = catchAsync(
  async (req: IGetCategoriesRequest, res: Response, next: NextFunction): Promise<void> => {
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 10;
    const skip = (page - 1) * limit;

    const categories = await categoryService.getCategories(limit, skip);

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: { categories },
    });
  }
);

/**
 *   @method GET
 *   @route ~/api/v1/categories/:id
 *   @desc Get Specific Category By id
 *   @access public
 */
export const getCategory = catchAsync(
  async (req: IGetCategoryRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const category = await categoryService.getCategory(id);
    if (!category) return next(AppError.custom(404, `No category for this id: ${id}`));

    res.status(200).json({ status: 'success', data: category });
  }
);

/**
 *   @method POST
 *   @route ~/api/v1/categories
 *   @desc Create New Category
 *   @access private
 */
export const createCategory = catchAsync(
  async (req: ICreateCategoryRequest, res: Response, next: NextFunction): Promise<void> => {
    const category = req.body;

    const newCategory = await categoryService.createCategory(category);

    res.status(201).json({ status: 'success', data: newCategory });
  }
);

/**
 *   @method PATCH
 *   @route ~/api/v1/categories/:id
 *   @desc Update specific category
 *   @access private
 */
export const updateCategory = catchAsync(
  async (req: IUpdateCategoryRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const newCategory = req.body;

    const updatedCategory = await categoryService.updateCategory(id, newCategory);

    res.status(200).json({ status: 'success', data: updatedCategory });
  }
);

/**
 *   @method DELETE
 *   @route ~/api/v1/categories/:id
 *   @desc Delete specific category
 *   @access private
 */
export const deleteCategory = catchAsync(
  async (req: IDeleteCategoryRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    await categoryService.deleteCategory(id);

    res.status(204).send();
  }
);
