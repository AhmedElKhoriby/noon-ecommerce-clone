import { Response, NextFunction } from 'express';
import { catchAsync } from './../utils/catchAsync';
import * as subCategoryService from '../services/subcategory.service';

import {
  IGetSubCategoriesRequest,
  IGetSubCategoryRequest,
  ICreateSubCategoryRequest,
  IUpdateSubCategoryRequest,
  IDeleteSubCategoryRequest,
} from '../types/subcategory.request.type';
import AppError from '../errors/appError';

/**
 *   @method GET
 *   @route ~/api/v1/subcategories
 *   @desc Get list of subcategories
 *   @access public
 */
export const getSubCategories = catchAsync(
  async (req: IGetSubCategoriesRequest, res: Response, next: NextFunction): Promise<void> => {
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 10;
    const skip = (page - 1) * limit;

    const subCategories = await subCategoryService.getSubCategories(limit, skip);

    res.status(200).json({
      status: 'success',
      results: subCategories.length,
      data: { subCategories },
    });
  }
);

/**
 *   @method GET
 *   @route ~/api/v1/subcategories/:id
 *   @desc Get a specific subcategory by ID
 *   @access public
 */
export const getSubCategory = catchAsync(
  async (req: IGetSubCategoryRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const subCategory = await subCategoryService.getSubCategory(id);
    if (!subCategory) return next(AppError.custom(404, `No subCategory found for ID: ${id}`));

    res.status(200).json({ status: 'success', data: subCategory });
  }
);

/**
 *   @method POST
 *   @route ~/api/v1/subcategories
 *   @desc Create a new subcategory
 *   @access private
 */
export const createSubCategory = catchAsync(
  async (req: ICreateSubCategoryRequest, res: Response, next: NextFunction): Promise<void> => {
    const subCategory = req.body;

    const newSubCategory = await subCategoryService.createSubCategory(subCategory);

    res.status(201).json({ status: 'success', data: newSubCategory });
  }
);

/**
 *   @method PATCH
 *   @route ~/api/v1/subcategories/:id
 *   @desc Update a specific subcategory
 *   @access private
 */
export const updateSubCategory = catchAsync(
  async (req: IUpdateSubCategoryRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const newSubCategory = req.body;

    const updatedSubCategory = await subCategoryService.updateSubCategory(id, newSubCategory);

    res.status(200).json({ status: 'success', data: updatedSubCategory });
  }
);

/**
 *   @method DELETE
 *   @route ~/api/v1/subcategories/:id
 *   @desc Delete a specific subcategory
 *   @access private
 */
export const deleteSubCategory = catchAsync(
  async (req: IDeleteSubCategoryRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    await subCategoryService.deleteSubCategory(id);

    res.status(204).send();
  }
);
