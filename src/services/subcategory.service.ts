import { Subcategory } from '@prisma/client';
import db from '../config/db.config';
import type { CreateSubCategoryInput, UpdateSubCategoryInput } from '../schemas/subcategory.schema';

/**
 * @desc Get a list of subcategories with pagination support
 * @param {number} limit - Number of subcategories to retrieve
 * @param {number} skip - Number of subcategories to skip (for pagination)
 * @returns {Promise<Subcategory[]>} - Array of subcategories
 */
export const getSubCategories = async (limit: number, skip: number): Promise<Subcategory[]> => {
  return await db.subcategory.findMany({
    skip,
    take: limit,
  });
};

/**
 * @desc Get a specific subcategory by its ID
 * @param {string} categoryId - ID of the subcategory to retrieve
 * @returns {Promise<Subcategory | null>} - The subcategory object or null if not found
 */
export const getSubCategory = async (id?: string, name?: string): Promise<Subcategory | null> => {
  return await db.subcategory.findUnique({
    where: { id },
  });
};

/**
 * @desc Create a new subcategory
 * @param {Object} newSubCategory - The subcategory data to create
 * @param {string} newSubCategory.name - Name of the subcategory
 * @param {string} newSubCategory.categoryId - The ID of the parent category
 * @returns {Promise<Subcategory>} - The created subcategory object
 */
export const createSubCategory = async (newSubCategory: CreateSubCategoryInput['body']): Promise<Subcategory> => {
  return await db.subcategory.create({
    data: {
      ...newSubCategory,
    },
  });
};

/**
 * @desc Update an existing subcategory by ID
 * @param {string} subCategoryId - ID of the subcategory to update
 * @param {string} updatedName - New name for the subcategory
 * @returns {Promise<Subcategory | null>} - The updated subcategory object or null if not found
 */
export const updateSubCategory = async (
  subCategoryId: string,
  updatedSubCategory: UpdateSubCategoryInput['body']
): Promise<Subcategory | null> => {
  return await db.subcategory.update({
    where: {
      id: subCategoryId,
    },
    data: {
      ...updatedSubCategory,
    },
  });
};

/**
 * @desc Delete a subcategory by ID
 * @param {string} subCategoryId - ID of the subcategory to delete
 * @returns {Promise<Subcategory | null>} - The deleted subcategory object or null if not found
 */
export const deleteSubCategory = async (subCategoryId: string): Promise<void> => {
  await db.subcategory.delete({
    where: {
      id: subCategoryId,
    },
  });
};
