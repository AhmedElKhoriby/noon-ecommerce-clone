import { Request } from 'express';
import {
  GetSubCategoriesInput,
  GetSubCategoryInput,
  CreateSubCategoryInput,
  UpdateSubCategoryInput,
  DeleteSubCategoryInput,
} from '../schemas/subcategory.schema';

export interface IGetSubCategoriesRequest extends Request {
  query: GetSubCategoriesInput['query'] & Record<string, any>;
}

export interface IGetSubCategoryRequest extends Request {
  params: GetSubCategoryInput['params'];
}

export interface ICreateSubCategoryRequest extends Request {
  body: CreateSubCategoryInput['body'];
}

export interface IUpdateSubCategoryRequest extends Request {
  body: UpdateSubCategoryInput['body'];
  params: UpdateSubCategoryInput['params'];
}

export interface IDeleteSubCategoryRequest extends Request {
  params: DeleteSubCategoryInput['params'];
}
