import { isDev } from '../../env';
import { Prisma } from '@prisma/client';
import { prismaErrors } from '../../utils/constants.ts/prismaErrorMessage';
const handlePrismaError = (err: unknown) => {
  let message = 'Database error';
  let statusCode = 500;
  let data = undefined;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.log('Prisma known request error:', err.message);

    statusCode = prismaErrors[err.code].statusCode;

    message = isDev ? `Prisma known request error: ${err.message}` : prismaErrors[err.code].userMessage;

    message = message
      .replace(/\u001b\[[0-9;]*m/g, '')
      .replace(/\n+/g, ' ')
      .replace('value', `${err.meta?.target ?? err.meta?.path}`);

    data = { ...prismaErrors[err.code].devMessage, ...err?.meta };
    data.message = data.message.replace('value', `${err.meta?.target ?? err.meta?.path}`);
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    console.log('Prisma unknown request error:');

    message = isDev
      ? `Prisma unknown request error: ${err.message}`
      : 'A database error occurred. Please try again later.';
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    console.log('Prisma validation error:');

    statusCode = 400;

    message = isDev ? `Prisma validation error: ${err.message}` : 'Invalid data provided. Please check your input.';

    data = err;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    console.log('Prisma initialization error:');

    message = isDev
      ? `Prisma initialization error: ${err.message}`
      : 'Failed to initialize the database connection. Please try again later.';
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    console.log('Prisma Rust panic error:');

    message = isDev
      ? `Prisma Rust panic error: ${err.message}`
      : 'A critical error occurred. Please restart the application.';
  } else {
    console.log('Unexpected DB error:');
    message = isDev
      ? `Unexpected error: ${err instanceof Error ? err.message : 'Unknown DB error'}`
      : prismaErrors.default.userMessage;
  }

  return { statusCode, message, data };
};

export default handlePrismaError;
