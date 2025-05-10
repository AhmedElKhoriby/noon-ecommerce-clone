import type { User } from '@prisma/client';
import * as userService from '../services/user.service';
import { catchAsync } from '../utils/catchAsync';
import type { NextFunction, Request } from 'express';
import env from '../env';
import jwt from 'jsonwebtoken';
import AppError from '../errors/appError';

interface JwtPayload {
  id: string;
  email?: string;
  role?: 'user' | 'admin' | 'manager';
  iat: number; // Issued At
  exp: number; // Expiration Time
}

/**
 * Extracts the Bearer token from the request headers.
 */
const extractBearerToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
};

/**
 * Checks if the user changed their password after the token was issued.
 */
const hasUserChangedPassword = (user: User, tokenIssuedAt: number): boolean => {
  if (!user.passwordChangedAt) return false;

  const passwordChangedAtTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
  return passwordChangedAtTimestamp > tokenIssuedAt;
};

/**
 * @middleware protect
 * @method   ALL
 * @route    Applies to all protected routes
 * @desc     Middleware to protect routes using JWT authentication.
 * @access   Private (requires a valid JWT token)
 * @usage    Place this middleware before any route that requires authentication.
 */
export const protect = catchAsync(async (req: Request, _, next: NextFunction): Promise<void> => {
  // 1) Check if token exist, if exist get
  const token = extractBearerToken(req);
  if (!token) return next(AppError.custom(401, 'You are not logged in! Please log in to get access.'));

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as JwtPayload;

  // 3) Check if user exists
  const user = await userService.getUser(decoded.id);
  if (!user) return next(AppError.custom(401, 'The user belonging to this token does no longer exist.'));

  // 4) Check if user change his password after token created
  if (hasUserChangedPassword(user, decoded.iat)) {
    return next(AppError.custom(401, 'User recently changed their password. Please login again.'));
  }

  req.user = user;

  next();
});

type Role = 'ADMIN' | 'MANAGER' | 'USER';

/**
 * @middleware protect
 * @method   POST (or any other HTTP method)
 * @route    ~/api/v1/auth/protect
 * @desc     Middleware to protect private routes using JWT authentication.
 * @access   Private (requires a valid JWT token)
 * @usage    This middleware should be placed before any route that requires authentication.
 */
export const allowedTo = (...roles: Role[]) =>
  catchAsync(async (req: Request, _, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.custom(401, 'You are not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(AppError.custom(403, 'You are not allowed to access this route'));
    }
    next();
  });
