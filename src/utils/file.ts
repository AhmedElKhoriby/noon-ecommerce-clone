import fs from 'fs';
import path from 'path';
import logger from './logger';

/**
 * Ensure directory exists, create if it doesn't
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    logger.error(`Failed to create directory ${dirPath}:`, error);
    throw error;
  }
};

/**
 * Delete file safely
 */
export const deleteFile = (filePath: string): boolean => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    logger.error(`Failed to delete file ${filePath}:`, error);
    return false;
  }
};

/**
 * Delete multiple files
 */
export const deleteFiles = (filePaths: string[]): { deleted: string[]; failed: string[] } => {
  const deleted: string[] = [];
  const failed: string[] = [];

  filePaths.forEach((filePath) => {
    if (deleteFile(filePath)) {
      deleted.push(filePath);
    } else {
      failed.push(filePath);
    }
  });

  return { deleted, failed };
};

/**
 * Get file size in bytes
 */
export const getFileSize = (filePath: string): number => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
};

/**
 * Check if file exists
 */
export const fileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

/**
 * Create directory recursively
 */
export const createDirectory = (dirPath: string): boolean => {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  } catch (error) {
    logger.error(`Failed to create directory ${dirPath}:`, error);
    return false;
  }
};

/**
 * Get file extension
 */
export const getFileExtension = (filePath: string): string => {
  return path.extname(filePath).toLowerCase();
};

/**
 * Get filename without extension
 */
export const getFilenameWithoutExtension = (filePath: string): string => {
  return path.basename(filePath, path.extname(filePath));
};

/**
 * Check if path is a directory
 */
export const isDirectory = (dirPath: string): boolean => {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
};

/**
 * Get all files in directory
 */
export const getFilesInDirectory = (dirPath: string): string[] => {
  try {
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    return fs.readdirSync(dirPath).filter((file) => fs.statSync(path.join(dirPath, file)).isFile());
  } catch (error) {
    logger.error(`Failed to read directory ${dirPath}:`, error);
    return [];
  }
};

/**
 * Move file from source to destination
 */
export const moveFile = (sourcePath: string, destPath: string): boolean => {
  try {
    // Ensure destination directory exists
    ensureDirectoryExists(path.dirname(destPath));

    fs.renameSync(sourcePath, destPath);
    return true;
  } catch (error) {
    logger.error(`Failed to move file from ${sourcePath} to ${destPath}:`, error);
    return false;
  }
};

/**
 * Copy file from source to destination
 */
export const copyFile = (sourcePath: string, destPath: string): boolean => {
  try {
    // Ensure destination directory exists
    ensureDirectoryExists(path.dirname(destPath));

    fs.copyFileSync(sourcePath, destPath);
    return true;
  } catch (error) {
    logger.error(`Failed to copy file from ${sourcePath} to ${destPath}:`, error);
    return false;
  }
};

/**
 * Default export object for backward compatibility
 */
export default {
  ensureDirectoryExists,
  deleteFile,
  deleteFiles,
  getFileSize,
  fileExists,
  createDirectory,
  getFileExtension,
  getFilenameWithoutExtension,
  isDirectory,
  getFilesInDirectory,
  moveFile,
  copyFile,
};
