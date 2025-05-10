import { Response, NextFunction } from 'express';
import { catchAsync } from './../utils/catchAsync';
import * as productService from '../services/product.service';

import {
  IGetProductsRequest,
  IGetProductRequest,
  ICreateProductRequest,
  IUpdateProductRequest,
  IDeleteProductRequest,
} from '../types/product.request.type';
import AppError from '../errors/appError';

/**
 *   @method GET
 *   @route ~/api/v1/products
 *   @desc Get list of products
 *   @access public
 */
export const getProducts = catchAsync(async (req: IGetProductsRequest, res: Response): Promise<void> => {
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;
  const skip = (page - 1) * limit;

  const products = await productService.getProducts(limit, skip);

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
});

/**
 *   @method GET
 *   @route ~/api/v1/products/:id
 *   @desc Get Specific Product By ID
 *   @access public
 */
export const getProduct = catchAsync(
  async (req: IGetProductRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const product = await productService.getProduct(id);
    if (!product) return next(AppError.custom(404, `No product found for this ID: ${id}`));

    res.status(200).json({ status: 'success', data: product });
  }
);

/**
 *   @method POST
 *   @route ~/api/v1/products
 *   @desc Create New Product
 *   @access private (Admin only)
 */
export const createProduct = catchAsync(async (req: ICreateProductRequest, res: Response): Promise<void> => {
  const product = req.body;

  const newProduct = await productService.createProduct(product);

  res.status(201).json({ status: 'success', data: newProduct });
});

/**
 *   @method PATCH
 *   @route ~/api/v1/products/:id
 *   @desc Update Specific Product
 *   @access private (Admin only)
 */
export const updateProduct = catchAsync(async (req: IUpdateProductRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedProduct = await productService.updateProduct(id, updatedData);

  res.status(200).json({ status: 'success', data: updatedProduct });
});

/**
 *   @method DELETE
 *   @route ~/api/v1/products/:id
 *   @desc Delete Specific Product
 *   @access private (Admin only)
 */
export const deleteProduct = catchAsync(async (req: IDeleteProductRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  await productService.deleteProduct(id);

  res.status(204).send();
});
