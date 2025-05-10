import { Request, Response, NextFunction } from 'express';
import { catchAsync } from './../utils/catchAsync';
import * as userService from '../services/user.service';

import {
  IGetUsersRequest,
  IGetUserRequest,
  ICreateUserRequest,
  IUpdateUserRequest,
  IDeleteUserRequest,
  type IUpdatePassUserRequest,
} from '../types/user.request.type';
import AppError from '../errors/appError';
import type { User } from '@prisma/client';

/**
 *   @method GET
 *   @route ~/api/v1/users
 *   @desc Get list of users
 *   @access private (Admin only)
 */
export const getUsers = catchAsync(async (req: IGetUsersRequest, res: Response): Promise<void> => {
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;
  const skip = (page - 1) * limit;

  const users = await userService.getUsers(limit, skip);

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

/**
 *   @method GET
 *   @route ~/api/v1/users/:id
 *   @desc Get Specific User By ID
 *   @access private (Admin or user himself)
 */
export const getUser = catchAsync(async (req: IGetUserRequest, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  const user = await userService.getUser(id);
  if (!user) return next(AppError.custom(404, `No user found for this ID: ${id}`));

  res.status(200).json({ status: 'success', data: user });
});

/**
 *   @method POST
 *   @route ~/api/v1/users
 *   @desc Create New User
 *   @access private (Admin only)
 */
export const createUser = catchAsync(async (req: ICreateUserRequest, res: Response): Promise<void> => {
  const user = req.body;

  const newUser = await userService.createUser(user);

  res.status(201).json({ status: 'success', data: newUser });
});

/**
 *   @method PATCH
 *   @route ~/api/v1/users/:id
 *   @desc Update Specific User
 *   @access private (Admin or user himself)
 */
export const updateUser = catchAsync(async (req: IUpdateUserRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedUser = await userService.updateUser(id, updatedData);

  res.status(200).json({ status: 'success', data: updatedUser });
});

/**
 *   @method PATCH
 *   @route ~/api/v1/users/change-password/:id
 *   @desc Update Specific User Password
 *   @access private (Admin or user himself)
 */
export const updateUserPass = catchAsync(async (req: IUpdatePassUserRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedUser = await userService.updateUserPass(id, updatedData);

  res.status(200).json({ status: 'success', data: updatedUser });
});

/**
 *   @method DELETE
 *   @route ~/api/v1/users/:id
 *   @desc Delete Specific User
 *   @access private (Admin only)
 */
export const deleteUser = catchAsync(async (req: IDeleteUserRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  await userService.deleteUser(id);

  res.status(204).send();
});

export const getLoggedUserData = catchAsync(async (req: IGetUserRequest, _, next: NextFunction): Promise<void> => {
  req.params.id = req.user!.id;
  next();
});

export const updateLoggedUserPass = catchAsync(
  async (req: IUpdatePassUserRequest, _, next: NextFunction): Promise<void> => {
    req.params.id = req.user!.id;
    next();
  }
);

export const deactivateLoggedUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await userService.deactivateUser(req.user!.id);
    res.status(204).send();
  }
);

export const updateLoggedUserData = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    req.params.id = req.user!.id;
    next();
  }
);
