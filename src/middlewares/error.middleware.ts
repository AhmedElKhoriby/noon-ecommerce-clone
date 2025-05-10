import { Request, Response, NextFunction, Application } from 'express';
import AppError from '../errors/appError';
import errorHandler from '../errors/error.handler';
import { isDev, isProd } from '../env';

export const setupErrorHandlers = (app: Application) => {
  // console.log('Setting up error handlers...');
  app.use(setupNotFoundHandler);
  app.use(setupGlobalErrorHandler);
  app.use(setupErrorResponse);
};

const setupNotFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(AppError.custom(404, `Can't find ${req.originalUrl} on this server!`));
};

const setupGlobalErrorHandler = async (err: unknown, req: Request, res: Response, next: NextFunction) => {
  next(await errorHandler(err));
};

const setupErrorResponse = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (isDev) {
    sendErrorDev(err, res);
  } else if (isProd) {
    sendErrorProd(err, res);
  }
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    data: err.data,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
