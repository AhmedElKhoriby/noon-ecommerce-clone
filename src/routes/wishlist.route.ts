import { Router } from 'express';
import * as wishlistControllers from '../controllers/wishlist.controller';
import * as wishlistSchemas from '../schemas/wishlist.schema';
import * as auth from '../middlewares/auth.middleware';
import validate from '../middlewares/validation.middleware';

const wishlistRouter = Router();

// Protect all wishlist routes (require authentication)
wishlistRouter.use(auth.protect);

// Wishlist Routes
wishlistRouter.post(
  '/',
  auth.allowedTo('USER'),
  validate(wishlistSchemas.addToWishlistSchema),
  wishlistControllers.addToWishlist
);

wishlistRouter.delete(
  '/:productId',
  auth.allowedTo('USER'),
  validate(wishlistSchemas.removeFromWishlistSchema),
  wishlistControllers.removeFromWishlist
);

wishlistRouter.get('/', auth.allowedTo('USER'), wishlistControllers.getWishlist);

export default wishlistRouter;
