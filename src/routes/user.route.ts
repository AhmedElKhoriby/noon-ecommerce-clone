import { Router } from 'express';
import * as userControllers from '../controllers/user.controller';
import * as userSchemas from '../schemas/user.schema';
import * as auth from '../middlewares/auth.middleware';
import validate from '../middlewares/validation.middleware';

const userRouter = Router();

// Routes

// Protect all routes after this middleware
userRouter.use(auth.protect);

// Routes for logged-in users
userRouter.get('/get-me', userControllers.getLoggedUserData, userControllers.getUser);
userRouter.put(
  '/change-my-password',
  validate(userSchemas.updateUserPassSchema),
  userControllers.updateLoggedUserPass,
  userControllers.updateUserPass
);
userRouter.put(
  '/update-me',
  validate(userSchemas.updateUserPassSchema),
  userControllers.updateLoggedUserData,
  userControllers.updateUser
);
userRouter.delete('/delete-me', userControllers.deactivateLoggedUser);

userRouter.use(auth.allowedTo('ADMIN', 'MANAGER'));

userRouter
  .route('/')
  .get(validate(userSchemas.getUsersSchema), userControllers.getUsers)
  .post(validate(userSchemas.createUserSchema), userControllers.createUser);

userRouter
  .route('/:id')
  .get(validate(userSchemas.getUserSchema), userControllers.getUser)
  .patch(validate(userSchemas.updateUserSchema), userControllers.updateUser)
  .delete(validate(userSchemas.deleteUserSchema), userControllers.deleteUser);

userRouter
  .route('/change-password/:id')
  .put(validate(userSchemas.updateUserPassSchema), userControllers.updateUserPass);

export default userRouter;
