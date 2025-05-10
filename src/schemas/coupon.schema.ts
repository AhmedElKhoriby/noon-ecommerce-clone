import { z, object, string, number, date } from 'zod';

const payload = {
  body: object({
    name: string({ required_error: 'Coupon name is required' }).min(3, 'Coupon name must be at least 3 characters'),
    discount: number({ required_error: 'Discount is required' })
      .min(1, 'Discount must be at least 1%')
      .max(100, 'Discount cannot exceed 100%'),
    expire: string({ required_error: 'Expiration date is required' }).transform((val) => new Date(val)),
  }).strict(),
};

const params = {
  params: object({
    id: string({ required_error: 'Coupon ID is required' }).uuid(),
  }).strict(),
};

const query = {
  query: object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).default(10).optional(),
  }).strict(),
};

export const getCouponsSchema = object({ ...query });
export const getCouponSchema = object({ ...params });
export const createCouponSchema = object({ ...payload });
export const updateCouponSchema = object({ ...payload, ...params });
export const deleteCouponSchema = object({ ...params });

export type GetCouponsInput = z.infer<typeof getCouponsSchema>;
export type GetCouponInput = z.infer<typeof getCouponSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type DeleteCouponInput = z.infer<typeof deleteCouponSchema>;
