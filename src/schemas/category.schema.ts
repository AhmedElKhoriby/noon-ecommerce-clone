import { z, object, string } from 'zod';

const payload = {
  body: object({
    name: string({ required_error: 'Category name is required.' })
      .min(2, 'Category name must be at least 2 characters long.')
      .max(32, 'Category name must be at most 32 characters long.'),
    image: string().optional(),
  }).strict(),
};

const params = {
  params: object({
    id: string({ required_error: 'Category ID is required.' }).uuid('Invalid UUID format.'),
  }).strict(),
};

const query = {
  query: object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).default(10).optional(),
  }).strict(),
};

// Validation Schemas
export const getCategoriesSchema = object({ ...query });
export const getCategorySchema = object({ ...params });
export const createCategorySchema = object({ ...payload });
export const updateCategorySchema = object({ ...payload, ...params });
export const deleteCategorySchema = object({ ...params });

// Type Inference
export type GetCategoriesInput = z.infer<typeof getCategoriesSchema>;
export type GetCategoryInput = z.infer<typeof getCategorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
