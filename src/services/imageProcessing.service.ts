import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { ensureDirectoryExists, deleteFile, fileExists } from '../utils/file';
import { uploadImage, deleteImage as deleteFromCloud } from './cloudStorage.service';
import AppError from '../errors/appError';

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ImageUploadResult {
  filename: string;
  localPath: string;
  cloudUrl?: string;
  cloudPublicId?: string;
  width?: number;
  height?: number;
  size?: number;
}

export interface ImageConfig {
  folder: string;
  prefix: string;
  processing: ImageProcessingOptions;
}

// Image configurations for different entities
const IMAGE_CONFIGS: Record<string, ImageConfig> = {
  category: {
    folder: 'categories',
    prefix: 'category',
    processing: { width: 500, height: 500, quality: 90, format: 'jpeg' },
  },
  product: {
    folder: 'products',
    prefix: 'product',
    processing: { width: 800, height: 800, quality: 85, format: 'jpeg' },
  },
  brand: {
    folder: 'brands',
    prefix: 'brand',
    processing: { width: 300, height: 300, quality: 90, format: 'jpeg' },
  },
  user: {
    folder: 'users',
    prefix: 'user',
    processing: { width: 200, height: 200, quality: 90, format: 'jpeg' },
  },
};

/**
 * Process image with sharp and save locally
 */
const processAndSaveLocal = async (
  buffer: Buffer,
  config: ImageConfig
): Promise<{ filename: string; localPath: string; metadata: sharp.OutputInfo }> => {
  const { folder, prefix, processing } = config;

  // Generate unique filename
  const filename = `${prefix}-${uuidv4()}-${Date.now()}.${processing.format || 'jpeg'}`;
  const uploadDir = path.join('uploads', folder);
  const localPath = path.join(uploadDir, filename);

  // Ensure directory exists
  ensureDirectoryExists(uploadDir);

  // Process image with sharp
  let sharpInstance = sharp(buffer);

  // Apply format
  if (processing.format === 'jpeg') {
    sharpInstance = sharpInstance.jpeg({ quality: processing.quality || 90 });
  } else if (processing.format === 'png') {
    sharpInstance = sharpInstance.png({ quality: processing.quality || 90 });
  } else if (processing.format === 'webp') {
    sharpInstance = sharpInstance.webp({ quality: processing.quality || 90 });
  }

  // Apply resize if specified
  if (processing.width || processing.height) {
    sharpInstance = sharpInstance.resize(processing.width, processing.height, {
      fit: 'cover',
      position: 'center',
    });
  }

  // Save to file
  const metadata = await sharpInstance.toFile(localPath);

  return { filename, localPath, metadata };
};

/**
 * Upload to cloudinary and delete local file if successful
 */
const uploadToCloudAndCleanup = async (
  localPath: string,
  folder: string,
  publicId?: string
): Promise<{ cloudUrl: string; cloudPublicId: string; width: number; height: number }> => {
  const result = await uploadImage(localPath, {
    folder,
    publicId,
  });

  // Delete local file after successful cloud upload
  deleteFile(localPath);

  return {
    cloudUrl: result.secure_url,
    cloudPublicId: result.public_id,
    width: result.width,
    height: result.height,
  };
};

/**
 * Main function: Process image and upload to cloud
 */
export const processAndUpload = async (
  buffer: Buffer,
  entityType: keyof typeof IMAGE_CONFIGS,
  uploadToCloud: boolean = true
): Promise<ImageUploadResult> => {
  const config = IMAGE_CONFIGS[entityType];
  if (!config) {
    throw AppError.custom(400, `Invalid entity type: ${entityType}`);
  }

  // Step 1: Process and save locally
  const { filename, localPath, metadata } = await processAndSaveLocal(buffer, config);

  const result: ImageUploadResult = {
    filename,
    localPath,
    size: metadata.size,
  };

  // Step 2: Upload to cloud if requested
  if (uploadToCloud) {
    try {
      const cloudData = await uploadToCloudAndCleanup(localPath, config.folder, filename.split('.')[0]);

      result.cloudUrl = cloudData.cloudUrl;
      result.cloudPublicId = cloudData.cloudPublicId;
      result.width = cloudData.width;
      result.height = cloudData.height;

      // Update local path to indicate it was deleted
      result.localPath = '';
    } catch (cloudError) {
      // If cloud upload fails, keep local file
      console.warn(`Cloud upload failed for ${filename}, keeping local copy`);
    }
  }

  return result;
};

/**
 * Delete image from both cloud and local storage
 */
export const deleteImage = async (cloudPublicId?: string, localPath?: string): Promise<void> => {
  const deletePromises: Promise<any>[] = [];

  // Delete from cloud
  if (cloudPublicId) {
    deletePromises.push(deleteFromCloud(cloudPublicId));
  }

  // Delete local file
  if (localPath && fileExists(localPath)) {
    deleteFile(localPath);
  }

  if (deletePromises.length > 0) {
    await Promise.allSettled(deletePromises);
  }
};

/**
 * Cleanup method for failed operations (synchronous)
 */
export const cleanupFailedUpload = (cloudPublicId?: string, localPath?: string): void => {
  // Delete local file immediately
  if (localPath) {
    deleteFile(localPath);
  }

  // Delete from cloud asynchronously (don't wait)
  if (cloudPublicId) {
    deleteFromCloud(cloudPublicId).catch((error) => {
      console.error('Failed to cleanup cloudinary image:', error);
    });
  }
};

/**
 * Specific functions for each entity
 */
export const processCategoryImage = async (buffer: Buffer): Promise<ImageUploadResult> => {
  return processAndUpload(buffer, 'category');
};

export const processProductImage = async (buffer: Buffer): Promise<ImageUploadResult> => {
  return processAndUpload(buffer, 'product');
};

export const processBrandImage = async (buffer: Buffer): Promise<ImageUploadResult> => {
  return processAndUpload(buffer, 'brand');
};

export const processUserImage = async (buffer: Buffer): Promise<ImageUploadResult> => {
  return processAndUpload(buffer, 'user');
};

/**
 * Process multiple images
 */
export const processMultipleImages = async (
  buffers: Buffer[],
  entityType: keyof typeof IMAGE_CONFIGS,
  uploadToCloud: boolean = true
): Promise<ImageUploadResult[]> => {
  const processPromises = buffers.map((buffer) => processAndUpload(buffer, entityType, uploadToCloud));
  return Promise.all(processPromises);
};

/**
 * Get image configuration for entity type
 */
export const getImageConfig = (entityType: keyof typeof IMAGE_CONFIGS): ImageConfig | null => {
  return IMAGE_CONFIGS[entityType] || null;
};

/**
 * Update image configuration
 */
export const updateImageConfig = (entityType: keyof typeof IMAGE_CONFIGS, newConfig: Partial<ImageConfig>): void => {
  if (IMAGE_CONFIGS[entityType]) {
    IMAGE_CONFIGS[entityType] = { ...IMAGE_CONFIGS[entityType], ...newConfig };
  }
};

/**
 * Default export object for backward compatibility
 */
export default {
  processAndSaveLocal,
  uploadToCloudAndCleanup,
  processAndUpload,
  deleteImage,
  cleanupFailedUpload,
  processCategoryImage,
  processProductImage,
  processBrandImage,
  processUserImage,
  processMultipleImages,
  getImageConfig,
  updateImageConfig,
  IMAGE_CONFIGS,
};
