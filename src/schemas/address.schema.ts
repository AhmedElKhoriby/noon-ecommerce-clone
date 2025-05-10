import { z, object, string } from 'zod';

// Common Address Schema
const addressPayload = {
  body: object({
    alias: string({ required_error: 'Address alias is required.' })
      .min(2, 'Alias must be at least 2 characters.')
      .max(50, 'Alias cannot exceed 50 characters.'),
    details: string({ required_error: 'Address details are required.' }).min(
      5,
      'Details must be at least 5 characters.'
    ),
    phone: string({ required_error: 'Phone number is required.' })
      .min(11, 'Phone number must be at least 11 characters.')
      .max(20, 'Phone number cannot exceed 20 characters.'),
    city: string({ required_error: 'City is required.' }).min(2, 'City must be at least 2 characters.'),
    postalCode: string().optional(),
  }).strict(),
};

const params = {
  params: object({
    id: string({ required_error: 'Address ID is required.' }).uuid('Invalid CUID format.'),
  }).strict(),
};

// Schemas
export const addAddressSchema = object({ ...addressPayload });
export const removeAddressSchema = object({ ...params });

// Types
export type addAddressInput = z.infer<typeof addAddressSchema>;
export type removeAddressInput = z.infer<typeof removeAddressSchema>;
