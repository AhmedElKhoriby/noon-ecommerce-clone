import { Request, Response, NextFunction } from 'express';
import { catchAsync } from './../utils/catchAsync';
import * as reviewService from '../services/review.service';

import {
  IGetReviewsRequest,
  IGetReviewRequest,
  ICreateReviewRequest,
  IUpdateReviewRequest,
  IDeleteReviewRequest,
} from '../types/review.request.type';
import AppError from '../errors/appError';

/**
 *   @method GET
 *   @route ~/api/v1/reviews
 *   @desc Get list of all reviews (with pagination)
 *   @access public
 */
export const getReviews = catchAsync(async (req: IGetReviewsRequest, res: Response, next: NextFunction) => {
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;
  const skip = (page - 1) * limit;

  const productId = req.params.productId ?? null;

  const reviews = await reviewService.getReviews(limit, skip, productId);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews,
  });
});

/**
 *   @method GET
 *   @route ~/api/v1/reviews/:id
 *   @desc Get specific review by ID
 *   @access public
 */
export const getReview = catchAsync(async (req: IGetReviewRequest, res: Response, next: NextFunction) => {
  const { id, productId } = req.params;

  const review = await reviewService.getReview(id, productId);
  if (!review) return next(AppError.custom(404, `No review found for this ID: ${id}`));

  res.status(200).json({ status: 'success', data: review });
});

export const setProductIdAndUserIdToBody = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  if (!req.body.productId) req.body.productId = req.params.productId;
  if (!req.body.userId) req.body.userId = req.user!.id;
  console.log(req.body);
  next();
});

/**
 *   @method POST
 *   @route ~/api/v1/reviews
 *   @desc Create a new review
 *   @access private (user only)
 */
export const createReview = catchAsync(async (req: ICreateReviewRequest, res: Response, next: NextFunction) => {
  const review = req.body;

  const newReview = await reviewService.createReview(review);

  res.status(201).json({ status: 'success', data: newReview });
});

/**
 *   @method PUT
 *   @route ~/api/v1/reviews/:id
 *   @desc Update specific review by ID
 *   @access private (user only)
 */
export const updateReview = catchAsync(async (req: IUpdateReviewRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedReview = await reviewService.updateReview(id, updatedData);

  res.status(200).json({ status: 'success', data: updatedReview });
});

/**
 *   @method DELETE
 *   @route ~/api/v1/reviews/:id
 *   @desc Delete specific review by ID
 *   @access private (user, manager, admin)
 */
export const deleteReview = catchAsync(async (req: IDeleteReviewRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await reviewService.deleteReview(id);

  res.status(204).send();
});
