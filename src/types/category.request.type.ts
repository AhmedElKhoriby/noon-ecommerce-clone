import { Request } from 'express';
import {
  GetCategoriesInput,
  GetCategoryInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  DeleteCategoryInput,
} from '../schemas/category.schema';

export interface IGetCategoriesRequest extends Request {
  query: GetCategoriesInput['query'] & Record<string, any>;
}

export interface IGetCategoryRequest extends Request {
  params: GetCategoryInput['params'];
}

export interface ICreateCategoryRequest extends Request {
  body: CreateCategoryInput['body'];
}

export interface IUpdateCategoryRequest extends Request {
  body: UpdateCategoryInput['body'];
  params: UpdateCategoryInput['params'];
}

export interface IDeleteCategoryRequest extends Request {
  params: DeleteCategoryInput['params'];
}
