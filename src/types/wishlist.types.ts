import { Request } from 'express';
import { addToWishlistInput, removeFromWishlistInput } from '../schemas/wishlist.schema';

export interface IAddToWishlistRequest extends Request {
  body: addToWishlistInput['body'];
}

export interface IRemoveFromWishlistRequest extends Request {
  params: removeFromWishlistInput['params'];
}
