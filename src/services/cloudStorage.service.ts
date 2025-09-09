import cloudinary from '../config/cloudinary.config';

export interface CloudinaryUploadOptions {
  folder: string; // folder name in cloudinary
  publicId?: string; // optional public ID (file name) in cloudinary
  transformation?: object; // optional transformation options
}

export interface CloudinaryUploadResult {
  secure_url: string; // URL of the uploaded image
  public_id: string; // Public ID of the uploaded image
  width: number;
  height: number;
  bytes: number; // Size of the uploaded image in bytes
}

/**
 * Upload single image to cloudinary
 */
export async function uploadImage(filePath: string, options: CloudinaryUploadOptions): Promise<CloudinaryUploadResult> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: `e-commerce/${options.folder}`,
    public_id: options.publicId,
    overwrite: true,
    resource_type: 'image',
    transformation: options.transformation,
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}
/**
 * Delete single image from cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  const result = await cloudinary.uploader.destroy(publicId);
  return result.result === 'ok';
}
/**
 * Delete multiple images from cloudinary
 */
export async function deleteMultipleImages(publicIds: string[]): Promise<{ deleted: string[]; failed: string[] }> {
  const result = await cloudinary.api.delete_resources(publicIds);
  return {
    deleted: Object.keys(result.deleted || {}),
    failed: Object.keys(result.not_found || {}),
  };
}

export default {
  uploadImage,
  deleteImage,
  deleteMultipleImages,
};
