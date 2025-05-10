import { z, object, string } from 'zod';

const createPayload = {
  body: object({
    title: string()
      .min(3, 'Title must be at least 3 characters long')
      .max(100, 'Title must be at most 100 characters long')
      .optional(),
    rating: z
      .number({
        required_error: 'Rating is required',
        invalid_type_error: 'Rating must be a number',
      })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    productId: string({ required_error: 'Product ID is required' }).uuid('Invalid UUID format'),
    userId: string({ required_error: 'user ID ID is required' }).uuid('Invalid UUID format'),
  }).strict(),
};

const updatePayload = {
  body: createPayload.body.omit({ productId: true, userId: true }).partial().strict(),
};

const params = {
  params: object({
    id: string({ required_error: 'Review ID is required' }).uuid('Invalid UUID format'),
    productId: string({ required_error: 'Product ID is required' }).uuid('Invalid UUID format').optional(),
  }).strict(),
};

const query = {
  query: object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).default(10).optional(),
  }).strict(),
};

// Validation Schemas
export const getReviewsSchema = object({
  ...query,
  params: object({
    productId: string({ required_error: 'Product ID is required' }).uuid('Invalid UUID format').optional(),
  }).strict(),
});
export const getReviewSchema = object({ ...params });
export const createReviewSchema = object({ ...createPayload });
export const updateReviewSchema = object({ ...updatePayload, ...params });
export const deleteReviewSchema = object({ ...params });

// Type Inference
export type GetReviewsInput = z.infer<typeof getReviewsSchema>;
export type GetReviewInput = z.infer<typeof getReviewSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type DeleteReviewInput = z.infer<typeof deleteReviewSchema>;
