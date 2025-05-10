import { Router } from 'express';
import * as cartControllers from '../controllers/cart.controller';
import * as cartSchemas from '../schemas/cart.schema';
import * as auth from '../middlewares/auth.middleware';
import validate from '../middlewares/validation.middleware';

const router = Router();

router.use(auth.protect, auth.allowedTo('USER'));

router
  .route('/')
  .post(validate(cartSchemas.addToCartSchema), cartControllers.addToCart)
  .get(cartControllers.getCart)
  .delete(cartControllers.clearCart);

router.put('/applyCoupon', validate(cartSchemas.applyCouponSchema), cartControllers.applyCoupon);

router
  .route('/:itemId')
  .put(validate(cartSchemas.updateCartItemSchema), cartControllers.updateCartItem)
  .delete(validate(cartSchemas.removeCartItemSchema), cartControllers.removeCartItem);

export default router;
