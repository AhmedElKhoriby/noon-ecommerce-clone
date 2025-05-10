import { Router } from 'express';
import * as subCategoryControllers from '../controllers/subcategory.controller';
import * as subCategorySchemas from '../schemas/subcategory.schema';
import * as auth from '../middlewares/auth.middleware';
import validate from '../middlewares/validation.middleware';

const subCategoryRouter = Router();

// Public Routes
subCategoryRouter.get(
  '/',
  validate(subCategorySchemas.getSubCategoriesSchema),
  subCategoryControllers.getSubCategories
);
subCategoryRouter.get('/:id', validate(subCategorySchemas.getSubCategorySchema), subCategoryControllers.getSubCategory);

// Protect all routes after this middleware
subCategoryRouter.use(auth.protect);

// Protected Routes
subCategoryRouter.post(
  '/',
  auth.allowedTo('ADMIN', 'MANAGER'),
  validate(subCategorySchemas.createSubCategorySchema),
  subCategoryControllers.createSubCategory
);

subCategoryRouter
  .route('/:id')
  .patch(
    auth.allowedTo('ADMIN', 'MANAGER'),
    validate(subCategorySchemas.updateSubCategorySchema),
    subCategoryControllers.updateSubCategory
  )
  .delete(
    auth.allowedTo('ADMIN'),
    validate(subCategorySchemas.deleteSubCategorySchema),
    subCategoryControllers.deleteSubCategory
  );

export default subCategoryRouter;
