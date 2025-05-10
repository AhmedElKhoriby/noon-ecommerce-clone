import { Response, NextFunction } from 'express';
import { catchAsync } from './../utils/catchAsync';
import * as brandService from '../services/brand.service';

import {
  IGetBrandsRequest,
  IGetBrandRequest,
  ICreateBrandRequest,
  IUpdateBrandRequest,
  IDeleteBrandRequest,
} from '../types/brand.request.type';
import AppError from '../errors/appError';

/**
 *   @method GET
 *   @route ~/api/v1/brands
 *   @desc Get list of brands
 *   @access public
 */
export const getBrands = catchAsync(async (req: IGetBrandsRequest, res: Response): Promise<void> => {
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;
  const skip = (page - 1) * limit;

  const brands = await brandService.getBrands(limit, skip);

  res.status(200).json({
    status: 'success',
    results: brands.length,
    data: { brands },
  });
});

/**
 *   @method GET
 *   @route ~/api/v1/brands/:id
 *   @desc Get Specific Brand By id
 *   @access public
 */
export const getBrand = catchAsync(async (req: IGetBrandRequest, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  const brand = await brandService.getBrand(id);
  if (!brand) return next(AppError.custom(404, `No brand for this id: ${id}`));

  res.status(200).json({ status: 'success', data: brand });
});

/**
 *   @method POST
 *   @route ~/api/v1/brands
 *   @desc Create New Brand
 *   @access private
 */
export const createBrand = catchAsync(async (req: ICreateBrandRequest, res: Response): Promise<void> => {
  const data = req.body;

  const newBrand = await brandService.createBrand(data);

  res.status(201).json({ status: 'success', data: newBrand });
});

/**
 *   @method PATCH
 *   @route ~/api/v1/brands/:id
 *   @desc Update specific brand
 *   @access private
 */
export const updateBrand = catchAsync(async (req: IUpdateBrandRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const newBrand = req.body;

  const updatedBrand = await brandService.updateBrand(id, newBrand);

  res.status(200).json({ status: 'success', data: updatedBrand });
});

/**
 *   @method DELETE
 *   @route ~/api/v1/brands/:id
 *   @desc Delete specific brand
 *   @access private
 */
export const deleteBrand = catchAsync(async (req: IDeleteBrandRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  await brandService.deleteBrand(id);

  res.status(204).send();
});
