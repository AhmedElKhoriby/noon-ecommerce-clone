import { z, object, string, number } from 'zod';

enum ColorEnum {
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  SILVER = 'SILVER',
  SPACE_GRAY = 'SPACE_GRAY',
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  GOLD = 'GOLD',
}

const cartItemPayload = {
  body: object({
    productId: string({ required_error: 'Product ID is required' }).uuid(),
    color: z.nativeEnum(ColorEnum),
    quantity: number().min(1).default(1),
  }).strict(),
};

const updateQuantityPayload = {
  body: object({
    quantity: number({ required_error: 'Quantity is required' }).min(1),
  }).strict(),
};

const couponPayload = {
  body: object({
    coupon: string({ required_error: 'Coupon code is required' }),
  }).strict(),
};

const params = {
  params: object({
    itemId: string({ required_error: 'Item ID is required' }).uuid(),
  }).strict(),
};

export const addToCartSchema = object({ ...cartItemPayload });
export const updateCartItemSchema = object({ ...updateQuantityPayload, ...params });
export const removeCartItemSchema = object({ ...params });
export const applyCouponSchema = object({ ...couponPayload });

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
