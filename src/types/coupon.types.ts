import { Request } from 'express';
import {
  CreateCouponInput,
  UpdateCouponInput,
  GetCouponInput,
  DeleteCouponInput,
  GetCouponsInput,
} from '../schemas/coupon.schema';

export interface IGetCouponsRequest extends Request {
  query: GetCouponsInput['query'] & Record<string, any>;
}

export interface IGetCouponRequest extends Request {
  params: GetCouponInput['params'];
}

export interface ICreateCouponRequest extends Request {
  body: CreateCouponInput['body'];
}

export interface IUpdateCouponRequest extends Request {
  body: UpdateCouponInput['body'];
  params: UpdateCouponInput['params'];
}

export interface IDeleteCouponRequest extends Request {
  params: DeleteCouponInput['params'];
}
