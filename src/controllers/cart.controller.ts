import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as cartService from '../services/cart.service';
import {
  IAddToCartRequest,
  IUpdateCartItemRequest,
  IRemoveCartItemRequest,
  IApplyCouponRequest,
} from '../types/cart.types';

export const addToCart = catchAsync(async (req: IAddToCartRequest, res: Response): Promise<void> => {
  const cart = await cartService.addToCart(req.user!.id, req.body);

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.CartItem.length,
    data: cart,
  });
});

export const getCart = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const cart = await cartService.getCart(req.user!.id);

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.CartItem.length,
    data: cart,
  });
});

export const updateCartItem = catchAsync(async (req: IUpdateCartItemRequest, res: Response): Promise<void> => {
  const cart = await cartService.updateCartItemQuantity(req.user!.id, {
    params: req.params,
    body: req.body,
  });

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.CartItem.length,
    data: cart,
  });
});

export const removeCartItem = catchAsync(async (req: IRemoveCartItemRequest, res: Response): Promise<void> => {
  const cart = await cartService.removeCartItem(req.user!.id, {
    params: req.params,
  });

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.CartItem.length,
    data: cart,
  });
});

export const clearCart = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await cartService.clearCart(req.user!.id);
  res.status(204).send();
});

export const applyCoupon = catchAsync(async (req: IApplyCouponRequest, res: Response): Promise<void> => {
  const cart = await cartService.applyCoupon(req.user!.id, req.body);

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.CartItem.length,
    data: cart,
  });
});
