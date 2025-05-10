import { Router } from 'express';
import * as addressControllers from '../controllers/address.controller';
import * as addressSchemas from '../schemas/address.schema';
import * as auth from '../middlewares/auth.middleware';
import validate from '../middlewares/validation.middleware';

const addressRouter = Router();

// Protect all routes
addressRouter.use(auth.protect);

// Routes
addressRouter.post(
  '/',
  auth.allowedTo('USER'),
  validate(addressSchemas.addAddressSchema),
  addressControllers.addAddress
);

addressRouter.delete(
  '/:id',
  auth.allowedTo('USER'),
  validate(addressSchemas.removeAddressSchema),
  addressControllers.removeAddress
);

addressRouter.get('/', auth.allowedTo('USER'), addressControllers.getAddresses);

export default addressRouter;
