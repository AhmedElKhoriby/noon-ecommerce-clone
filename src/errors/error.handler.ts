import AppError from './appError';
import HttpStatusCode from '../utils/constants.ts/HttpStatusCode';

const globalErrorHandlerMiddleware = async (errorToHandle: unknown): Promise<AppError> => {
  try {
    const appError = await AppError.from(errorToHandle);
    console.error(appError);
    return appError;
  } catch (handlingError: unknown) {
    // Not using the logger here because it might have failed
    process.stdout.write(
      'The error handler failed, here are the handler failure and then the origin error that it tried to handle.'
    );
    process.stdout.write(JSON.stringify(handlingError));
    process.stdout.write(JSON.stringify(errorToHandle));
  }
  return AppError.custom(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error.');
};

export default globalErrorHandlerMiddleware;
