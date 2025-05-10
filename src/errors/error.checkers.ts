import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const isPrismaError = (err: unknown) => {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientRustPanicError
  );
};

export const isJwtError = (err: unknown): boolean => {
  return (
    err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError || err instanceof jwt.NotBeforeError
  );
};
