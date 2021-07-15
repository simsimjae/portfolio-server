import * as os from 'os';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

import { Bucket } from '@google-cloud/storage';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';
import { uuid } from 'uuidv4';

import config from './config';
import * as logs from './logs';

export function resize(file: any, size: any) {
  let height, width;
  if (size.indexOf(',') !== -1) {
    [width, height] = size.split(',');
  } else if (size.indexOf('x') !== -1) {
    [width, height] = size.split('x');
  } else {
    throw new Error("height and width are not delimited by a ',' or a 'x'");
  }

  return sharp(file)
    .rotate()
    .resize(parseInt(width, 10), parseInt(height, 10), {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer();
}

export function convertType(buffer: any, format: any) {
  if (format === 'jpg' || format === 'jpeg') {
    return sharp(buffer).jpeg().toBuffer();
  }

  if (format === 'png') {
    return sharp(buffer).png().toBuffer();
  }

  if (format === 'webp') {
    return sharp(buffer).webp().toBuffer();
  }

  if (format === 'tiff') {
    return sharp(buffer).tiff().toBuffer();
  }

  return buffer;
}

/**
 * Supported file types
 */
export const supportedContentTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp'];

export const supportedImageContentTypeMap = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  tiff: 'image/tiff',
  webp: 'image/webp',
} as any;

export const modifyImage = async ({
  bucket,
  originalFile,
  fileDir,
  fileNameWithoutExtension,
  fileExtension,
  contentType,
  objectMetadata,
  format,
}: {
  bucket: Bucket;
  originalFile: string;
  fileDir: string;
  fileNameWithoutExtension: string;
  fileExtension: string;
  contentType: string;
  objectMetadata: ObjectMetadata;
  format: string;
}): Promise<any> => {
  const shouldFormatImage = format !== 'false';
  const imageContentType = shouldFormatImage ? supportedImageContentTypeMap[format] : contentType;
  // const modifiedExtensionName = fileExtension && shouldFormatImage ? `.${format}` : fileExtension;
  const modifiedFileName = `${fileNameWithoutExtension}`;

  // Path where modified image will be uploaded to in Storage.
  const modifiedFilePath = path.normalize(config.resizedImagesPath ? path.join(fileDir, config.resizedImagesPath, modifiedFileName) : path.join(fileDir, modifiedFileName));
  let modifiedFile = '';

  try {
    modifiedFile = path.join(os.tmpdir(), modifiedFileName);

    // Cloud Storage files.
    const metadata: { [key: string]: any } = {
      contentDisposition: objectMetadata.contentDisposition,
      contentEncoding: objectMetadata.contentEncoding,
      contentLanguage: objectMetadata.contentLanguage,
      contentType: imageContentType,
      metadata: objectMetadata.metadata || {},
    };
    metadata.metadata.resizedImage = true;
    if (config.cacheControlHeader) {
      metadata.cacheControl = config.cacheControlHeader;
    } else {
      metadata.cacheControl = objectMetadata.cacheControl;
    }

    // If the original image has a download token, add a
    // new token to the image being resized #323
    if (metadata.metadata.firebaseStorageDownloadTokens) {
      metadata.metadata.firebaseStorageDownloadTokens = uuid();
    }

    // Generate a resized image buffer using Sharp.
    // logs.imageResizing(modifiedFile, size);
    // let modifiedImageBuffer = await resize(originalFile, size);
    // logs.imageResized(modifiedFile);

    // Generate a converted image type buffer using Sharp.

    let modifiedImageBuffer;

    if (shouldFormatImage) {
      logs.imageConverting(fileExtension, format);
      modifiedImageBuffer = await convertType(originalFile, format);
      logs.imageConverted(format);
    }

    // Generate a image file using Sharp.
    await sharp(modifiedImageBuffer).toFile(modifiedFile);

    // Uploading the modified image.
    logs.imageUploading(modifiedFilePath);
    await bucket.upload(modifiedFile, {
      destination: modifiedFilePath,
      contentType: 'image/webp',
      metadata,
    });
    logs.imageUploaded(modifiedFile);
    return { success: true };
  } catch (err) {
    logs.error(err);
    return { success: false };
  } finally {
    try {
      // Make sure the local resized file is cleaned up to free up disk space.
      if (modifiedFile!) {
        logs.tempResizedFileDeleting(modifiedFilePath);
        fs.unlinkSync(modifiedFile);
        logs.tempResizedFileDeleted(modifiedFilePath);
      }
    } catch (err) {
      logs.errorDeleting(err);
    }
  }
};
