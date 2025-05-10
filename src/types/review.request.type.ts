import { Request } from 'express';
import {
  GetReviewsInput,
  GetReviewInput,
  CreateReviewInput,
  UpdateReviewInput,
  DeleteReviewInput,
} from '../schemas/review.schema';

export interface IGetReviewsRequest extends Request {
  query: GetReviewsInput['query'] & Record<string, any>;
}

export interface IGetReviewRequest extends Request {
  params: GetReviewInput['params'];
}

export interface ICreateReviewRequest extends Request {
  body: CreateReviewInput['body'];
}

export interface IUpdateReviewRequest extends Request {
  body: UpdateReviewInput['body'];
  params: UpdateReviewInput['params'];
}

export interface IDeleteReviewRequest extends Request {
  params: DeleteReviewInput['params'];
}
