import { ZodError } from 'zod';
import util from 'util';
import { isPrismaError, isJwtError } from './error.checkers';
import { fromZodError } from 'zod-validation-error';
import handlePrismaError from './handlers/prisma.handler';
import handleJWTError from './handlers/jwt.handler';

class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly data: unknown;

  private constructor(statusCode: number, message: string, data: unknown = undefined, isOperational: boolean = true) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    this.data = data;

    Error.captureStackTrace(this);
  }

  static custom(statusCode: number, message: string) {
    return new AppError(statusCode, message);
  }

  static from(err: unknown) {
    // console.log(typeof err);
    if (err instanceof AppError) return err;
    if (err instanceof ZodError) {
      return this.fromZod(err);
    }
    if (isPrismaError(err)) {
      return this.fromPrisma(err);
    }
    if (isJwtError(err)) {
      return this.fromJWT(err);
    }
    if (err instanceof Error) {
      return this.fromError(err);
    }

    return new AppError(500, 'Internal server error');
  }

  private static fromError(err: Error, statusCode: number = 500) {
    return new AppError(statusCode, err.message);
  }

  private static fromZod(err: ZodError, statusCode: number = 400) {
    const formattedError = fromZodError(err);
    return new AppError(statusCode, formattedError.message, formattedError.details);
  }

  private static fromPrisma(err: unknown) {
    const handledError = handlePrismaError(err);
    return new AppError(handledError.statusCode, handledError.message, handledError.data);
  }

  private static fromJWT(err: unknown) {
    const handledErrorMessage = handleJWTError(err);
    return new AppError(401, handledErrorMessage);
  }

  format(...args: unknown[]) {
    return new AppError(this.statusCode, util.format(this.message, ...args), this.data, this.isOperational);
  }
}

export default AppError;
