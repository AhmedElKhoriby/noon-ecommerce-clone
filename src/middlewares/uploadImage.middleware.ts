import multer from 'multer';
import AppError from '../errors/appError';

const storage = multer.memoryStorage();

const fileFilter = function (req: any, file: any, cb: any) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(AppError.custom(400, 'Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ storage, fileFilter });

export const uploadSingleImage = (fieldName: string) => upload.single(fieldName);

export const uploadMixOfImages = (arrayOfFields: multer.Field[]) => upload.fields(arrayOfFields);
