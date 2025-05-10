import { Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as couponService from '../services/coupon.service';
import {
  ICreateCouponRequest,
  IUpdateCouponRequest,
  IGetCouponRequest,
  IDeleteCouponRequest,
  IGetCouponsRequest,
} from '../types/coupon.types';

export const getCoupons = catchAsync(async (req: IGetCouponsRequest, res: Response): Promise<void> => {
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;
  const skip = (page - 1) * limit;

  const coupons = await couponService.getCoupons(limit, skip);
  res.status(200).json({
    status: 'success',
    results: coupons.length,
    data: coupons,
  });
});

export const getCoupon = catchAsync(
  async (req: IGetCouponRequest, res: Response, next: NextFunction): Promise<void> => {
    const coupon = await couponService.getCoupon(req.params.id);

    res.status(200).json({
      status: 'success',
      data: coupon,
    });
  }
);

export const createCoupon = catchAsync(async (req: ICreateCouponRequest, res: Response): Promise<void> => {
  const coupon = await couponService.createCoupon(req.body);
  res.status(201).json({
    status: 'success',
    data: coupon,
  });
});

export const updateCoupon = catchAsync(async (req: IUpdateCouponRequest, res: Response): Promise<void> => {
  const coupon = await couponService.updateCoupon({
    params: req.params,
    body: req.body,
  });
  res.status(200).json({
    status: 'success',
    data: coupon,
  });
});

export const deleteCoupon = catchAsync(async (req: IDeleteCouponRequest, res: Response): Promise<void> => {
  await couponService.deleteCoupon(req.params.id);
  res.status(204).send();
});
