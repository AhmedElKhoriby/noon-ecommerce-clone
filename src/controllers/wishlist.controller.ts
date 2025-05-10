import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as wishlistService from '../services/wishlist.service';
import { IAddToWishlistRequest, IRemoveFromWishlistRequest } from '../types/wishlist.types';

/**
 * @method POST
 * @route ~/api/v1/wishlist
 * @desc Add product to user's wishlist
 * @access Protected/User
 */
export const addToWishlist = catchAsync(
  async (req: IAddToWishlistRequest, res: Response, next: NextFunction): Promise<void> => {
    const { productId } = req.body;
    const userId = req.user!.id;

    const wishlistItem = await wishlistService.addToWishlist(userId, productId);

    res.status(201).json({
      status: 'success',
      message: 'Product added successfully to your wishlist.',
      data: wishlistItem,
    });
  }
);

/**
 * @method DELETE
 * @route ~/api/v1/wishlist/:productId
 * @desc Remove product from user's wishlist
 * @access Protected/User
 */
export const removeFromWishlist = catchAsync(async (req: IRemoveFromWishlistRequest, res: Response): Promise<void> => {
  const { productId } = req.params;
  const userId = req.user!.id;

  await wishlistService.removeFromWishlist(userId, productId);

  res.status(204).send();
});

/**
 * @method GET
 * @route ~/api/v1/wishlist
 * @desc Get logged user wishlist
 * @access Protected/User
 */
export const getWishlist = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const { items, count } = await wishlistService.getWishlist(userId);

  res.status(200).json({
    status: 'success',
    results: count,
    data: items,
  });
});
