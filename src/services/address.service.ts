import { Address } from '@prisma/client';
import db from '../config/db.config';
import type { addAddressInput } from '../schemas/address.schema';
import AppError from '../errors/appError';

/**
 * @desc Add a new address for a user
 * @param userId - The user's ID
 * @param addressData - Address details
 * @returns The created address
 */
export const addAddress = async (userId: string, addressData: addAddressInput['body']): Promise<Address> => {
  return await db.address.create({
    data: {
      ...addressData,
      userId,
    },
  });
};

/**
 * @desc Remove an address by ID (only if it belongs to the user)
 * @param userId - The user's ID
 * @param addressId - The address ID to remove
 */
export const removeAddress = async (userId: string, addressId: string): Promise<void> => {
  const address = await db.address.findUnique({
    where: { id: addressId },
  });

  if (!address) throw AppError.custom(404, 'Address not found');
  if (address.userId !== userId) throw AppError.custom(403, 'Not authorized to delete this address');

  await db.address.delete({
    where: { id: addressId },
  });
};

/**
 * @desc Get all addresses for a user
 * @param userId - The user's ID
 * @returns List of addresses
 */
export const getAddresses = async (userId: string): Promise<Address[]> => {
  return await db.address.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};
