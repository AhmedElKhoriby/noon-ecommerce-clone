import { Request, Response, NextFunction } from 'express';
import { upload } from '../config/multer.config';
import ImageService from '../services/imageProcessing.service';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../errors/appError';

// Generic upload middleware
export const uploadSingleImage = (fieldName: string) => upload.single(fieldName);

export const uploadMultipleImages = (fieldName: string, maxCount: number = 5) => upload.array(fieldName, maxCount);

// Image processing middlewares
export const processCategoryImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(AppError.custom(400, 'Please upload an image'));
  }

  try {
    const result = await ImageService.processCategoryImage(req.file.buffer);

    // Store image data in request
    req.body.image = result.cloudUrl || result.filename;
    req.body.imageCloudId = result.cloudPublicId;
    req.body.imageLocalPath = result.localPath;
    req.body.imageMetadata = {
      width: result.width,
      height: result.height,
      size: result.size,
    };

    next();
  } catch (error) {
    return next(AppError.custom(500, 'Image processing failed'));
  }
});

export const processProductImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(AppError.custom(400, 'Please upload an image'));
  }

  try {
    const result = await ImageService.processProductImage(req.file.buffer);

    req.body.image = result.cloudUrl || result.filename;
    req.body.imageCloudId = result.cloudPublicId;
    req.body.imageLocalPath = result.localPath;

    next();
  } catch (error) {
    return next(AppError.custom(500, 'Image processing failed'));
  }
});

export const processBrandImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(AppError.custom(400, 'Please upload an image'));
  }

  try {
    const result = await ImageService.processBrandImage(req.file.buffer);

    req.body.image = result.cloudUrl || result.filename;
    req.body.imageCloudId = result.cloudPublicId;
    req.body.imageLocalPath = result.localPath;

    next();
  } catch (error) {
    return next(AppError.custom(500, 'Image processing failed'));
  }
});

export const processUserImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(AppError.custom(400, 'Please upload an image'));
  }

  try {
    const result = await ImageService.processUserImage(req.file.buffer);

    req.body.image = result.cloudUrl || result.filename;
    req.body.imageCloudId = result.cloudPublicId;
    req.body.imageLocalPath = result.localPath;

    next();
  } catch (error) {
    return next(AppError.custom(500, 'Image processing failed'));
  }
});
