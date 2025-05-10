import { z, object, string } from 'zod';

const payload = {
  body: object({
    name: string({ required_error: 'Brand name is required.' })
      .min(2, 'Brand name must be at least 2 characters long.')
      .max(32, 'Brand name must be at most 32 characters long.'),
    image: string().optional(),
  }).strict(),
};

const params = {
  params: object({
    id: string({ required_error: 'Brand ID is required.' }).uuid('Invalid UUID format.'),
  }).strict(),
};

const query = {
  query: object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).default(10).optional(),
  }).strict(),
};

// Validation Schemas
export const getBrandsSchema = object({ ...query });
export const getBrandSchema = object({ ...params });
export const createBrandSchema = object({ ...payload });
export const updateBrandSchema = object({ ...payload, ...params });
export const deleteBrandSchema = object({ ...params });

// Type Inference
export type getBrandsInput = z.infer<typeof getBrandsSchema>;
export type getBrandInput = z.infer<typeof getBrandSchema>;
export type createBrandInput = z.infer<typeof createBrandSchema>;
export type updateBrandInput = z.infer<typeof updateBrandSchema>;
export type deleteBrandInput = z.infer<typeof deleteBrandSchema>;
