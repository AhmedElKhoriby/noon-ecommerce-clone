import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import type { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as userService from '../services/user.service';
import type {
  ILoginRequest,
  ISignupRequest,
  IForgetPasswordRequest,
  IVerifyPasswordRequest,
  IResetPasswordRequest,
} from '../types/auth.request.types';
import AppError from '../errors/appError';
import sendEmail from '../utils/Email';
import { catchAsync } from './../utils/catchAsync';
import env from '../env';

/**
 *   @method  POST
 *   @route   ~/api/v1/auth/signup
 *   @desc    Sign up User
 *   @access  public
 */
export const signup = catchAsync(async (req: ISignupRequest, res: Response): Promise<void> => {
  const newUser = await userService.createUser(req.body);

  const token = createToken(newUser.id);

  res.status(201).json({ status: 'success', data: { user: newUser, token } });
});

/**
 *   @method  POST
 *   @route   ~/api/v1/auth/login
 *   @desc    Login User
 *   @access  public
 */
export const login = catchAsync(async (req: ILoginRequest, res: Response, next: NextFunction): Promise<void> => {
  const user = await userService.getUserByEmail(req.body.email);

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(AppError.custom(401, 'Invalid credentials'));
  }

  const token = createToken(user.id);

  const { password, ...userWithoutPassword } = user;

  res.status(201).json({ status: 'success', data: { user: userWithoutPassword, token } });
});

/**
 *   @method  POST
 *   @route   POST ~/api/v1/auth/forget-password
 *   @desc    Forgot password
 *   @access  Public
 */
export const forgetPassword = catchAsync(async (req: IForgetPasswordRequest, res: Response, next: NextFunction) => {
  const user = await userService.getUserByEmail(req.body.email);

  if (!user) {
    return next(AppError.custom(404, `There is no user with that email: ${req.body.email}`));
  }

  const resetCode = await userService.generateAndSaveResetCode(user.id);

  const message = `Hi ${user.name},\nWe received a request to reset the password on your E-shop Account.\n${resetCode}\nEnter this code to complete the reset.\nThanks for helping us keep your account secure.\nThe E-shop Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    await userService.clearResetCode(user.id);
    return next(AppError.custom(500, 'There was an error sending the email'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Reset code sent to email',
  });
});

/**
 * @desc    Verify password reset code
 * @route   POST /api/v1/auth/verifyResetCode
 * @access  Public
 */
export const verifyPassResetCode = catchAsync(
  async (req: IVerifyPasswordRequest, res: Response, next: NextFunction) => {
    const { resetCode } = req.body;

    const user = await userService.findUserByResetCode(resetCode);

    if (!user) {
      return next(AppError.custom(400, 'Reset code is invalid or has expired'));
    }

    await userService.markResetCodeAsVerified(user.id);

    res.status(200).json({
      status: 'success',
    });
  }
);

const createToken = (id: string) => jwt.sign({ id }, env.JWT_SECRET_KEY, { expiresIn: env.JWT_EXPIRE_TIME });

/**
 *  @method  POST
 *  @desc    Reset password
 *  @route   POST ~/api/v1/auth/reset-password
 *  @access  Public
 */
export const resetPassword = catchAsync(async (req: IResetPasswordRequest, res: Response, next: NextFunction) => {
  const { email, newPassword } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user) {
    return next(AppError.custom(404, `There is no user with that email: ${req.body.email}`));
  }

  if (!user.passwordResetVerified) {
    return next(AppError.custom(400, 'Reset code not verified'));
  }

  await userService.resetUserPassword(user.id, newPassword);

  const token = createToken(user.id);

  res.status(200).json({ status: 'success', data: { token } });
});
