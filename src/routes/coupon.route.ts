import { Router } from 'express';
import * as couponControllers from '../controllers/coupon.controller';
import * as couponSchemas from '../schemas/coupon.schema';
import * as auth from '../middlewares/auth.middleware';
import validate from '../middlewares/validation.middleware';

const router = Router();

router.use(auth.protect, auth.allowedTo('ADMIN', 'MANAGER'));

router
  .route('/')
  .get(couponControllers.getCoupons)
  .post(validate(couponSchemas.createCouponSchema), couponControllers.createCoupon);

router
  .route('/:id')
  .get(validate(couponSchemas.getCouponSchema), couponControllers.getCoupon)
  .put(validate(couponSchemas.updateCouponSchema), couponControllers.updateCoupon)
  .delete(validate(couponSchemas.deleteCouponSchema), couponControllers.deleteCoupon);

export default router;
