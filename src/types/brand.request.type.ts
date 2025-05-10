import { Request } from 'express';
import {
  getBrandsInput,
  getBrandInput,
  createBrandInput,
  updateBrandInput,
  deleteBrandInput,
} from '../schemas/brand.schema';

export interface IGetBrandsRequest extends Request {
  query: getBrandsInput['query'] & Record<string, any>;
}

export interface IGetBrandRequest extends Request {
  params: getBrandInput['params'];
}

export interface ICreateBrandRequest extends Request {
  body: createBrandInput['body'];
}

export interface IUpdateBrandRequest extends Request {
  body: updateBrandInput['body'];
  params: updateBrandInput['params'];
}

export interface IDeleteBrandRequest extends Request {
  params: deleteBrandInput['params'];
}
