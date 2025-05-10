import { z, object, string } from 'zod';

const payload = {
  body: object({
    productId: string({ required_error: 'Product ID is required.' }).uuid('Invalid UUID format.'),
  }).strict(),
};

const params = {
  params: object({
    productId: string({ required_error: 'Product ID is required.' }).uuid('Invalid UUID format.'),
  }).strict(),
};

// Validation Schemas
export const addToWishlistSchema = object({ ...payload });
export const removeFromWishlistSchema = object({ ...params });

// Type Inference
export type addToWishlistInput = z.infer<typeof addToWishlistSchema>;
export type removeFromWishlistInput = z.infer<typeof removeFromWishlistSchema>;
