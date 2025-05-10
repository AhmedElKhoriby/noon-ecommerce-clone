import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as addressService from '../services/address.service';
import { IAddAddressRequest, IRemoveAddressRequest } from '../types/address.request.type';

/**
 * @method POST
 * @route /api/v1/addresses
 * @desc Add a new address for the logged-in user
 * @access Private/User
 */
export const addAddress = catchAsync(async (req: IAddAddressRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const addressData = req.body;

  const newAddress = await addressService.addAddress(userId, addressData);

  res.status(201).json({
    status: 'success',
    data: newAddress,
  });
});

/**
 * @method DELETE
 * @route /api/v1/addresses/:id
 * @desc Remove an address (only if it belongs to the user)
 * @access Private/User
 */
export const removeAddress = catchAsync(
  async (req: IRemoveAddressRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const addressId = req.params.id;

    await addressService.removeAddress(userId, addressId);

    res.status(204).send();
  }
);

/**
 * @method GET
 * @route /api/v1/addresses
 * @desc Get all addresses for the logged-in user
 * @access Private/User
 */
export const getAddresses = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const addresses = await addressService.getAddresses(userId);

  res.status(200).json({
    status: 'success',
    results: addresses.length,
    data: addresses,
  });
});
