import express, { type Application, type Request, type Response } from 'express';
import categoryRoute from './category.route';
import subCategoryRoute from './subcategory.route';
import brandRoute from './brand.route';
import userRouter from './user.route';
import authRouter from './auth.route';
import productRouter from './product.route';
import reviewRouter from './review.route';
import wishlistRouter from './wishlist.route';
import addressRouter from './address.route';
import couponRouter from './coupon.route';
import cartRouter from './cart.route';

export const setupRoutes = (app: Application) => {
  // Health Check Endpoint
  app.get('/', (_, res: Response) => {
    res.status(200).json({
      msg: 'Everything is working great!',
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
    });
  });

  const apiRouter = express.Router();

  apiRouter.use('/categories', categoryRoute);
  apiRouter.use('/subcategories', subCategoryRoute);
  apiRouter.use('/brands', brandRoute);
  apiRouter.use('/products', productRouter);
  apiRouter.use('/users', userRouter);
  apiRouter.use('/auth', authRouter);
  apiRouter.use('/reviews', reviewRouter);
  apiRouter.use('/wishlist', wishlistRouter);
  apiRouter.use('/address', addressRouter);
  apiRouter.use('/coupon', couponRouter);
  apiRouter.use('/cart', cartRouter);

  app.use('/api/v1', apiRouter);
};
