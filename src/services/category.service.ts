import { Category } from '@prisma/client';
import db from '../config/db.config';
import type { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema';

/**
 * @desc Get a list of categories with pagination support
 * @param {number} limit - Number of categories to retrieve
 * @param {number} skip - Number of categories to skip (for pagination)
 * @returns {Promise<Category[]>} - Array of categories
 */
export const getCategories = async (limit: number, skip: number): Promise<Category[]> => {
  return await db.category.findMany({
    skip,
    take: limit,
  });
};

/**
 * @desc Get a specific category by its ID
 * @param {string} categoryId - ID of the category to retrieve
 * @returns {Promise<Category | null>} - The category object or null if not found
 */
export const getCategory = async (id: string): Promise<Category | null> => {
  return await db.category.findUnique({
    where: { id },
  });
};

/**
 * @desc Create a new category
 * @param {Object} newCategory - The category data to create
 * @param {string} newCategory.name - Name of the category
 * @returns {Promise<Category>} - The created category object
 */
export const createCategory = async (newCategory: CreateCategoryInput['body']): Promise<Category> => {
  return await db.category.create({
    data: {
      ...newCategory,
    },
  });
};

/**
 * @desc Update an existing category by ID
 * @param {string} categoryId - ID of the category to update
 * @param {string} updatedName - New name for the category
 * @returns {Promise<Category | null>} - The updated category object or null if not found
 */
export const updateCategory = async (
  CategoryId: string,
  updatedCategory: UpdateCategoryInput['body']
): Promise<Category | null> => {
  return await db.category.update({
    where: {
      id: CategoryId,
    },
    data: {
      ...updatedCategory,
    },
  });
};

/**
 * @desc Delete a category by ID
 * @param {string} categoryId - ID of the category to delete
 * @returns {Promise<Category | null>} - The deleted category object or null if not found
 */
export const deleteCategory = async (categoryId: string): Promise<void> => {
  await db.category.delete({
    where: {
      id: categoryId,
    },
  });
};
