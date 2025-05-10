import { Product } from '@prisma/client';
import db from '../config/db.config';
import type { CreateProductInput } from '../schemas/product.schema';
import type { IUpdateProductRequest } from '../types/product.request.type';

/**
 * @desc Get a list of products with pagination support
 * @param {number} limit - Number of products to retrieve
 * @param {number} skip - Number of products to skip (for pagination)
 * @returns {Promise<Product[]>} - Array of products
 */
export const getProducts = async (limit: number, skip: number): Promise<Product[]> => {
  return await db.product.findMany({
    skip,
    take: limit,
  });
};

/**
 * @desc Get a specific product by its ID
 * @param {string} id - ID of the product to retrieve
 * @returns {Promise<Product | null>} - The product object or null if not found
 */
export const getProduct = async (id: string): Promise<Product | null> => {
  return await db.product.findUnique({
    where: { id },
    include: { Review: true },
  });
};

/**
 * @desc Create a new product
 * @param {Object} newProduct - The product data to create
 * @returns {Promise<Product>} - The created product object
 */
export const createProduct = async (newProduct: CreateProductInput['body']): Promise<Product> => {
  return await db.product.create({
    data: {
      ...newProduct,
    },
  });
};

/**
 * @desc Update an existing product by ID
 * @param {string} productId - ID of the product to update
 * @param {Object} updatedData - Updated product data
 * @returns {Promise<Product | null>} - The updated product object or null if not found
 */
export const updateProduct = async (
  productId: string,
  updatedData: IUpdateProductRequest['body']
): Promise<Product | null> => {
  return await db.product.update({
    where: {
      id: productId,
    },
    data: {
      ...updatedData,
    },
  });
};

/**
 * @desc Delete a product by ID
 * @param {string} productId - ID of the product to delete
 * @returns {Promise<void>} - Deletes the product
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  await db.product.delete({
    where: {
      id: productId,
    },
  });
};
