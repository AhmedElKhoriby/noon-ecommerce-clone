import { z, object, string, array } from 'zod';

enum ColorEnum {
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  SILVER = 'SILVER',
  SPACE_GRAY = 'SPACE_GRAY',
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  GOLD = 'GOLD',
}

const createPayload = {
  body: object({
    name: string({ required_error: 'Product name is required.' })
      .min(2, 'Product name must be at least 2 characters long.')
      .max(64, 'Product name must be at most 64 characters long.'),

    description: string({ required_error: 'Product description is required.' })
      .min(10, 'Product description must be at least 10 characters long.')
      .max(1000, 'Product description must be at most 1000 characters long.'),

    quantity: z.coerce.number({ required_error: 'Product quantity is required.' }).int().min(0),

    sold: z.coerce.number().int().min(0).default(0).optional(),

    price: z.coerce.number({ required_error: 'Product price is required.' }).min(0),

    priceAfterDiscount: z.coerce.number().min(0).optional(),

    colors: z.array(z.nativeEnum(ColorEnum)).optional(), // Assuming colors are stored as an array of strings

    imageCover: string({ required_error: 'Product cover image is required.' }).url('Invalid image URL format.'),

    images: array(string().url('Invalid image URL format.')).default([]).optional(),

    ratingsAverage: z.coerce.number().min(0).max(5).optional(),

    ratingsQuantity: z.coerce.number().int().min(0).default(0).optional(),

    categoryId: string({ required_error: 'Category ID is required.' }).uuid('Invalid Category ID format.'),

    subcategoryId: string().uuid('Invalid Category ID format.').optional(),

    brandId: string().uuid('Invalid Category ID format.').optional(),
  }).strict(),
};

const updatePayload = {
  body: createPayload.body.omit({ categoryId: true, subcategoryId: true, brandId: true }).partial().strict(),
};

const params = {
  params: object({
    id: string({ required_error: 'Product ID is required.' }).uuid('Invalid UUID format.'),
  }).strict(),
};

const query = {
  query: object({
    page: z.coerce.number().int().min(1).default(1).optional(),

    limit: z.coerce.number().int().min(1).default(10).optional(),

    //. TODO
    // minPrice: z.coerce.number().min(0).optional(),
    // maxPrice: z.coerce.number().min(0).optional(),
    // categoryId: string().uuid().optional(),
    // brandId: string().uuid().optional(),
  }).strict(),
};

// Validation Schemas
export const getProductsSchema = object({ ...query });
export const getProductSchema = object({ ...params });
export const createProductSchema = object({ ...createPayload });
export const updateProductSchema = object({ ...updatePayload, ...params });
export const deleteProductSchema = object({ ...params });

// Type Inference
export type GetProductsInput = z.infer<typeof getProductsSchema>;
export type GetProductInput = z.infer<typeof getProductSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
