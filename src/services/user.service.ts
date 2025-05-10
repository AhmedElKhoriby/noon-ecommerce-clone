import { User } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import db from '../config/db.config';
import type { CreateUserInput, CreateUserPassInput, UpdateUserInput } from '../schemas/user.schema';
import AppError from '../errors/appError';

/**
 * @desc Get a list of users with pagination support
 * @param {number} limit - Number of users to retrieve
 * @param {number} skip - Number of users to skip (for pagination)
 * @returns {Promise<User[]>} - Array of users
 */
export const getUsers = async (limit: number, skip: number): Promise<User[]> => {
  return await db.user.findMany({
    skip,
    take: limit,
  });
};

/**
 * @desc Get a specific user by its ID or email
 * @param {string} id - ID of the user to retrieve
 * @returns {Promise<User | null>} - The user object or null if not found
 */
export const getUser = async (id: string): Promise<User | null> => {
  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) throw AppError.custom(404, `No user found with ID: ${id}`);

  return user;
};

/**
 * @desc Get a specific user by their email
 * @param {string} email - Email of the user to retrieve
 * @returns {Promise<User | null>} - The user object or null if not found
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) throw AppError.custom(404, `No user found with this email: ${email}`);

  return user;
};

/**
 * @desc Create a new user
 * @param {Object} newUser - The user data to create
 * @returns {Promise<User>} - The created user object
 */

export const createUser = async (newUser: CreateUserInput['body']): Promise<User> => {
  return await db.user.create({
    data: {
      ...newUser,
    },
  });
};

/**
 * @desc Update an existing user by ID
 * @param {string} userId - ID of the user to update
 * @param {Object} updatedData - Updated user data
 * @returns {Promise<User | null>} - The updated user object or null if not found
 */
export const updateUser = async (userId: string, updatedData: UpdateUserInput['body']): Promise<User | null> => {
  return await db.user.update({
    where: {
      id: userId,
    },
    data: {
      ...updatedData,
    },
  });
};

/**
 * @desc Update an existing user by ID
 * @param {string} userId - ID of the user to update
 * @param {Object} updatedData - Updated user data
 * @returns {Promise<User | null>} - The updated user object or null if not found
 */
export const updateUserPass = async (userId: string, passData: CreateUserPassInput['body']): Promise<User | null> => {
  const currentUser = await getUser(userId);
  if (!currentUser) throw AppError.custom(404, 'User not found');

  const isCorrectPassword = await bcrypt.compare(passData.currentPassword, currentUser.password);
  if (!isCorrectPassword) {
    throw AppError.custom(400, 'Current password is incorrect');
  }

  return await db.user.update({
    where: {
      id: userId,
    },
    data: {
      password: passData.newPassword,
      passwordChangedAt: new Date(),
    },
  });
};

/**
 * @desc Delete a user by ID
 * @param {string} userId - ID of the user to delete
 * @returns {Promise<User | null>} - The deleted user object or null if not found
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await db.user.delete({
    where: {
      id: userId,
    },
  });
};

/**
 * @desc    Generate and save a password reset code for the user
 * @param   {string} userId - The user's ID
 * @returns {Promise<string>} - The generated reset code
 */
export const generateAndSaveResetCode = async (userId: string) => {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

  await db.user.update({
    where: { id: userId },
    data: {
      passwordResetCode: hashedResetCode,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      passwordResetVerified: false,
    },
  });

  return resetCode;
};

/**
 * @desc    Clear reset fields if email fails to send
 * @param   {string} userId - The user's ID
 */
export const clearResetCode = async (userId: string) => {
  await db.user.update({
    where: { id: userId },
    data: {
      passwordResetCode: null,
      passwordResetExpires: null,
      passwordResetVerified: false,
    },
  });
};

/**
 * @desc    Find user by reset code and check expiration
 * @param   {string} resetCode - The reset code provided by the user
 * @returns {Promise<User | null>} - User object if found and valid, otherwise null
 */
export const findUserByResetCode = async (resetCode: number) => {
  const hashedResetCode = crypto.createHash('sha256').update(resetCode.toString()).digest('hex');

  return await db.user.findFirst({
    where: {
      passwordResetCode: hashedResetCode,
      passwordResetExpires: {
        gt: new Date(), // Ensure the code is not expired
      },
    },
  });
};

/**
 * @desc    Mark reset code as verified
 * @param   {string} userId - The user's ID
 */
export const markResetCodeAsVerified = async (userId: string) => {
  await db.user.update({
    where: { id: userId },
    data: {
      passwordResetVerified: true,
    },
  });
};

/**
 * @desc    Reset user password
 * @param   {string} userId - The user's ID
 * @param   {string} newPassword - The new password
 */
export const resetUserPassword = async (userId: string, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await db.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      passwordResetCode: null,
      passwordResetExpires: null,
      passwordResetVerified: false,
    },
  });
};

/**
 * @desc   Deactivate a user (soft delete)
 * @param  {string} userId - ID of the user to deactivate
 * @returns {Promise<User | null>} - The updated user object
 */
export const deactivateUser = async (userId: string): Promise<User | null> => {
  return await db.user.update({
    where: { id: userId },
    data: {
      active: false,
    },
  });
};

/**
 * @desc   Activate a user
 * @param  {string} userId - ID of the user to activate
 * @returns {Promise<User | null>} - The updated user object
 */
export const activateUser = async (userId: string): Promise<User | null> => {
  return await db.user.update({
    where: { id: userId },
    data: {
      active: true,
    },
  });
};
