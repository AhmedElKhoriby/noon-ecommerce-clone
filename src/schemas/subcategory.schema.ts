import { z, object, string } from 'zod';

const createPayload = {
  body: object({
    name: string({ required_error: 'SubCategory name is required.' })
      .min(2, 'SubCategory name must be at least 2 characters long.')
      .max(32, 'SubCategory name must be at most 32 characters long.'),
    image: string().optional(),
    categoryId: string({ required_error: 'Category ID is required.' }).uuid('Invalid UUID format.'),
  }).strict(),
};

const updatePayload = {
  body: createPayload.body.omit({ categoryId: true }).partial().strict(),
};

const params = {
  params: object({
    id: string({ required_error: 'SubCategory ID is required.' }).uuid('Invalid UUID format.'),
  }).strict(),
};

const query = {
  query: object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).default(10).optional(),
  }).strict(),
};

// Validation Schemas
export const getSubCategoriesSchema = object({ ...query });
export const getSubCategorySchema = object({ ...params });
export const createSubCategorySchema = object({ ...createPayload });
export const updateSubCategorySchema = object({ ...updatePayload, ...params });
export const deleteSubCategorySchema = object({ ...params });

// Type Inference
export type GetSubCategoryInput = z.infer<typeof getSubCategorySchema>;
export type GetSubCategoriesInput = z.infer<typeof getSubCategoriesSchema>;
export type CreateSubCategoryInput = z.infer<typeof createSubCategorySchema>;
export type UpdateSubCategoryInput = z.infer<typeof updateSubCategorySchema>;
export type DeleteSubCategoryInput = z.infer<typeof deleteSubCategorySchema>;
