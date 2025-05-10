import { Request } from 'express';
import { addAddressInput, removeAddressInput } from '../schemas/address.schema';

export interface IAddAddressRequest extends Request {
  body: addAddressInput['body'];
}

export interface IRemoveAddressRequest extends Request {
  params: removeAddressInput['params'];
}
