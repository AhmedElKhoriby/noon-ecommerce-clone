import multer from 'multer';
import AppError from '../errors/appError';

// memory storage engine
const storage = multer.memoryStorage();

// file filter for images only
const fileFilter = function (req: any, file: any, cb: any) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    // only images!
    cb(AppError.custom(400, 'Not an image! Please upload only images.'), false);
  }
};

// multer upload instance with configration
export const upload = multer({ storage, fileFilter });
