import { Router } from 'express';
import * as brandControllers from '../controllers/brand.controller';
import * as brandSchemas from '../schemas/brand.schema';
import * as auth from '../middlewares/auth.middleware';
import validate from '../middlewares/validation.middleware';

const brandRouter = Router();

// Routes

// Public Routes
brandRouter.get('/', validate(brandSchemas.getBrandsSchema), brandControllers.getBrands);
brandRouter.get('/:id', validate(brandSchemas.getBrandSchema), brandControllers.getBrand);

// Protect all routes after this middleware
brandRouter.use(auth.protect);

// Protected Routes
brandRouter
  .route('/')
  .post(auth.allowedTo('ADMIN', 'MANAGER'), validate(brandSchemas.createBrandSchema), brandControllers.createBrand);

brandRouter
  .route('/:id')
  .patch(auth.allowedTo('ADMIN', 'MANAGER'), validate(brandSchemas.updateBrandSchema), brandControllers.updateBrand)
  .delete(auth.allowedTo('ADMIN'), validate(brandSchemas.deleteBrandSchema), brandControllers.deleteBrand);

export default brandRouter;
