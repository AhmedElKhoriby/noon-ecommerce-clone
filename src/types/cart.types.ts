import { Request } from 'express';
import { AddToCartInput, UpdateCartItemInput, RemoveCartItemInput, ApplyCouponInput } from '../schemas/cart.schema';

export interface IAddToCartRequest extends Request {
  body: AddToCartInput['body'];
}

export interface IUpdateCartItemRequest extends Request {
  body: UpdateCartItemInput['body'];
  params: UpdateCartItemInput['params'];
}

export interface IRemoveCartItemRequest extends Request {
  params: RemoveCartItemInput['params'];
}

export interface IApplyCouponRequest extends Request {
  body: ApplyCouponInput['body'];
}
