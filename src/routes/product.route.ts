import { Router } from 'express';
import * as productControllers from '../controllers/product.controller';
import * as productSchemas from '../schemas/product.schema';
import * as auth from '../middlewares/auth.middleware';
import validate from '../middlewares/validation.middleware';
import reviewRouter from './review.route';

const productRouter = Router();

// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
productRouter.use('/:productId/reviews', reviewRouter);

// Public Routes
productRouter.get('/', validate(productSchemas.getProductsSchema), productControllers.getProducts);
productRouter.get('/:id', validate(productSchemas.getProductSchema), productControllers.getProduct);

// Protect all routes after this middleware
productRouter.use(auth.protect);

// Protected Routes
productRouter
  .route('/')
  .post(
    auth.allowedTo('ADMIN', 'MANAGER'),
    validate(productSchemas.createProductSchema),
    productControllers.createProduct
  );

productRouter
  .route('/:id')
  .patch(
    auth.allowedTo('ADMIN', 'MANAGER'),
    validate(productSchemas.updateProductSchema),
    productControllers.updateProduct
  )
  .delete(auth.allowedTo('ADMIN'), validate(productSchemas.deleteProductSchema), productControllers.deleteProduct);

export default productRouter;
