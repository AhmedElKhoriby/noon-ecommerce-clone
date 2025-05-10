import { Request } from 'express';
import {
  GetProductsInput,
  GetProductInput,
  CreateProductInput,
  UpdateProductInput,
  DeleteProductInput,
} from '../schemas/product.schema';

export interface IGetProductsRequest extends Request {
  query: GetProductsInput['query'] & Record<string, any>;
}

export interface IGetProductRequest extends Request {
  params: GetProductInput['params'];
}

export interface ICreateProductRequest extends Request {
  body: CreateProductInput['body'];
}

export interface IUpdateProductRequest extends Request {
  body: UpdateProductInput['body'];
  params: UpdateProductInput['params'];
}

export interface IDeleteProductRequest extends Request {
  params: DeleteProductInput['params'];
}
