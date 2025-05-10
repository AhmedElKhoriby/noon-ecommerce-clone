import { Coupon } from '@prisma/client';
import db from '../config/db.config';
import { CreateCouponInput, UpdateCouponInput } from '../schemas/coupon.schema';

export const getCoupons = async (limit: number, skip: number): Promise<Coupon[]> => {
  return await db.coupon.findMany({
    where: { active: true },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
};

export const getCoupon = async (id: string): Promise<Coupon | null> => {
  return await db.coupon.findUniqueOrThrow({
    where: { id, active: true },
  });
};

export const createCoupon = async (input: CreateCouponInput['body']): Promise<Coupon> => {
  return await db.coupon.create({
    data: {
      ...input,
    },
  });
};

export const updateCoupon = async (input: UpdateCouponInput): Promise<Coupon> => {
  const { id } = input.params;
  return await db.coupon.update({
    where: { id },
    data: {
      ...input.body,
    },
  });
};

export const deleteCoupon = async (id: string): Promise<void> => {
  await db.coupon.update({
    where: { id },
    data: { active: false },
  });
};
