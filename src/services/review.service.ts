import { Review } from '@prisma/client';
import db from '../config/db.config';

/**
 * @desc Get a list of reviews with pagination support
 * @param {number} limit - Number of reviews to retrieve
 * @param {number} skip - Number of reviews to skip (for pagination)
 * @param {string} productId - Optional product ID to filter reviews
 * @returns {Promise<Review[]>} - Array of reviews
 */
export const getReviews = async (limit: number, skip: number, productId?: string): Promise<Review[]> => {
  return await db.review.findMany({
    where: { productId: productId || undefined }, // This allows fetching reviews for a specific product or all reviews if no productId is given
    skip,
    take: limit,
    include: { user: { select: { name: true } } },
  });
};

/**
 * @desc Get a specific review by its ID
 * @param {string} id - ID of the review to retrieve
 * @returns {Promise<Review | null>} - The review object or null if not found
 */
export const getReview = async (id: string, productId?: string): Promise<Review | null> => {
  return await db.review.findUnique({
    where: { productId: productId || undefined, id },
    include: { user: { select: { name: true } } },
  });
};

/**
 * @desc Create a new review
 * @param {Object} data - The review data to create
 * @param {string} [data.title] - Optional title of the review
 * @param {number} data.ratings - Rating value
 * @param {string} data.userId - ID of the user creating the review
 * @param {string} data.productId - ID of the product being reviewed
 * @returns {Promise<Review>} - The created review object
 */
export const createReview = async (data: {
  title?: string;
  rating: number;
  userId: string;
  productId: string;
}): Promise<Review> => {
  const review = await db.review.create({
    data: {
      title: data.title,
      rating: data.rating,
      userId: data.userId,
      productId: data.productId,
    },
  });

  await updateProductRatingStats(data.productId);
  return review;
};

/**
 * @desc Update an existing review by ID
 * @param {string} reviewId - ID of the review to update
 * @param {Object} updateData - The review data to update
 * @param {string} [updateData.title] - New title for the review
 * @param {number} [updateData.ratings] - New rating value
 * @returns {Promise<Review | null>} - The updated review object or null if not found
 */
export const updateReview = async (
  reviewId: string,
  updateData: Partial<Pick<Review, 'title' | 'rating'>>
): Promise<Review | null> => {
  const updatedReview = await db.review.update({
    where: { id: reviewId },
    data: updateData,
  });

  await updateProductRatingStats(updatedReview.productId);

  return updatedReview;
};

/**
 * @desc Delete a review by ID
 * @param {string} reviewId - ID of the review to delete
 * @returns {Promise<void>}
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  const review = await db.review.findUniqueOrThrow({
    where: { id: reviewId },
  });

  await db.review.delete({
    where: { id: reviewId },
  });

  await updateProductRatingStats(review.productId);
};

/**
 * @desc Update product rating statistics (average and count)
 * @param {string} productId - ID of the product to update
 */
const updateProductRatingStats = async (productId: string) => {
  const stats = await db.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });

  await db.product.update({
    where: { id: productId },
    data: {
      ratingsAverage: stats._avg.rating ?? 0,
      ratingsQuantity: stats._count ?? 0,
    },
  });
};
