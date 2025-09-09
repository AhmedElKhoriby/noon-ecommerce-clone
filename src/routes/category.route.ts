import { Router } from 'express';
import * as categoryControllers from '../controllers/category.controller';
import * as categorySchemas from '../schemas/category.schema';
import * as auth from '../middlewares/auth.middleware';
import validate from '../middlewares/validation.middleware';

const categoryRouter = Router();

// Public Routes
categoryRouter.get('/', validate(categorySchemas.getCategoriesSchema), categoryControllers.getCategories);
categoryRouter.get('/:id', validate(categorySchemas.getCategorySchema), categoryControllers.getCategory);

// Protect all routes after this middleware
categoryRouter.use(auth.protect);

// Protected Routes
categoryRouter
  .route('/')
  .post(
    auth.allowedTo('ADMIN', 'MANAGER'),
    categoryControllers.uploadCategoryImage,
    categoryControllers.resizeImage,
    validate(categorySchemas.createCategorySchema),
    categoryControllers.createCategory
  );

categoryRouter
  .route('/:id')
  .patch(
    auth.allowedTo('ADMIN', 'MANAGER'),
    categoryControllers.uploadCategoryImage,
    categoryControllers.resizeImage,
    validate(categorySchemas.updateCategorySchema),
    categoryControllers.updateCategory
  )
  .delete(auth.allowedTo('ADMIN'), validate(categorySchemas.deleteCategorySchema), categoryControllers.deleteCategory);

export default categoryRouter;
