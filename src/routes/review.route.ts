import { Router } from 'express';
import * as reviewControllers from '../controllers/review.controller';
import * as reviewSchemas from '../schemas/review.schema';
import * as auth from '../middlewares/auth.middleware';
import validate from '../middlewares/validation.middleware';

const reviewRouter = Router({ mergeParams: true });

// Public Routes
reviewRouter.get('/', validate(reviewSchemas.getReviewsSchema), reviewControllers.getReviews);
reviewRouter.get('/:id', validate(reviewSchemas.getReviewSchema), reviewControllers.getReview);

// Protect all routes after this middleware
reviewRouter.use(auth.protect);

// Protected Routes
reviewRouter.post(
  '/',
  auth.allowedTo('USER'),
  reviewControllers.setProductIdAndUserIdToBody, // nested route
  validate(reviewSchemas.createReviewSchema),
  reviewControllers.createReview
);

reviewRouter
  .route('/:id')
  .patch(auth.allowedTo('USER'), validate(reviewSchemas.updateReviewSchema), reviewControllers.updateReview)
  .delete(
    auth.allowedTo('USER', 'MANAGER', 'ADMIN'),
    validate(reviewSchemas.deleteReviewSchema),
    reviewControllers.deleteReview
  );

export default reviewRouter;
