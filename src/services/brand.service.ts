import { Brand } from '@prisma/client';
import db from '../config/db.config';
import type { createBrandInput, updateBrandInput } from '../schemas/brand.schema';

/**
 * @desc Get a list of brands with pagination support
 * @param {number} limit - Number of brands to retrieve
 * @param {number} skip - Number of brands to skip (for pagination)
 * @returns {Promise<Brand[]>} - Array of brands
 */
export const getBrands = async (limit: number, skip: number): Promise<Brand[]> => {
  return await db.brand.findMany({
    skip,
    take: limit,
  });
};

/**
 * @desc Get a specific brand by its ID
 * @param {string} brandId - ID of the brand to retrieve
 * @returns {Promise<Brand | null>} - The brand object or null if not found
 */
export const getBrand = async (id: string): Promise<Brand | null> => {
  return await db.brand.findUnique({
    where: { id },
  });
};

/**
 * @desc Create a new brand
 * @param {Object} newBrand - The brand data to create
 * @param {string} newBrand.name - Name of the brand
 * @returns {Promise<Brand>} - The created brand object
 */
export const createBrand = async (newBrand: createBrandInput['body']): Promise<Brand> => {
  return await db.brand.create({
    data: {
      ...newBrand,
    },
  });
};

/**
 * @desc Update an existing brand by ID
 * @param {string} brandId - ID of the brand to update
 * @param {string} updatedName - New name for the brand
 * @returns {Promise<Brand | null>} - The updated brand object or null if not found
 */
export const updateBrand = async (BrandId: string, updatedBrand: updateBrandInput['body']): Promise<Brand | null> => {
  return await db.brand.update({
    where: {
      id: BrandId,
    },
    data: {
      ...updatedBrand,
    },
  });
};

/**
 * @desc Delete a brand by ID
 * @param {string} brandId - ID of the brand to delete
 * @returns {Promise<Brand | null>} - The deleted brand object or null if not found
 */
export const deleteBrand = async (brandId: string): Promise<void> => {
  await db.brand.delete({
    where: {
      id: brandId,
    },
  });
};
