import { Wishlist, Product } from '@prisma/client';
import db from '../config/db.config';
import type { addToWishlistInput } from '../schemas/wishlist.schema';
import AppError from '../errors/appError';

/**
 * @desc Add product to user's wishlist
 * @param {string} userId - ID of the user
 * @param {string} productId - ID of the product to add
 * @returns {Promise<Wishlist>} - The created wishlist item
 * @throws {AppError} - If product is already in wishlist
 */
export const addToWishlist = async (userId: string, productId: string): Promise<Wishlist> => {
  return await db.wishlist.create({
    data: {
      userId,
      productId,
    },
    include: {
      product: true,
      user: true,
    },
  });
};

/**
 * @desc Remove product from user's wishlist
 * @param {string} userId - ID of the user
 * @param {string} productId - ID of the product to remove
 * @returns {Promise<void>}
 */
export const removeFromWishlist = async (userId: string, productId: string): Promise<void> => {
  await db.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};

/**
 * @desc Get user's wishlist with pagination
 * @param {string} userId - ID of the user
 * @param {number} limit - Number of items to retrieve
 * @param {number} skip - Number of items to skip
 * @returns {Promise<{items: Wishlist[], count: number}>} - Wishlist items and total count
 */
export const getWishlist = async (
  userId: string
): Promise<{ items: (Wishlist & { product: Pick<Product, 'id' | 'name' | 'price'> })[]; count: number }> => {
  const [items, count] = await Promise.all([
    db.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.wishlist.count({ where: { userId } }),
  ]);

  return { items, count };
};
