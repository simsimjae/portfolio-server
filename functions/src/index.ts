import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as functions from 'firebase-functions';
import * as mkdirp from 'mkdirp';
import * as os from 'os';
import * as path from 'path';
import * as sharp from 'sharp';

import { modifyImage, supportedContentTypes } from './resize-image';
import config, { deleteImage } from './config';
import * as logs from './logs';
import { extractFileNameWithoutExtension, startsWithArray } from './util';

sharp.cache(false);

// Initialize the Firebase Admin SDK
admin.initializeApp();

logs.init();

/**
 * When an image is uploaded in the Storage bucket, we generate a resized image automatically using
 * the Sharp image converting library.
 */
export const generateResizedImage = functions
  .region('asia-northeast3')
  .storage.object()
  .onFinalize(async (object): Promise<void> => {
    logs.start();
    const { contentType } = object; // This is the image MIME type

    const tmpFilePath = path.resolve('/', path.dirname(object.name!)); // Absolute path to dirname

    if (!contentType) {
      logs.noContentType();
      return;
    }

    if (!contentType.startsWith('image/')) {
      logs.contentTypeInvalid(contentType);
      return;
    }

    if (object.contentEncoding === 'gzip') {
      logs.gzipContentEncoding();
      return;
    }

    if (!supportedContentTypes.includes(contentType)) {
      logs.unsupportedType(supportedContentTypes, contentType);
      return;
    }

    if (config.includePathList && !startsWithArray(config.includePathList, tmpFilePath)) {
      logs.imageOutsideOfPaths(config.includePathList, tmpFilePath);
      return;
    }

    if (config.excludePathList && startsWithArray(config.excludePathList, tmpFilePath)) {
      logs.imageInsideOfExcludedPaths(config.excludePathList, tmpFilePath);
      return;
    }

    if (object.metadata && object.metadata.resizedImage === 'true') {
      logs.imageAlreadyResized();
      return;
    }

    const bucket = admin.storage().bucket(object.bucket);
    const filePath = object.name; // File path in the bucket.
    const fileDir = path.dirname(filePath!);
    const fileExtension = path.extname(filePath!);
    const fileNameWithoutExtension = extractFileNameWithoutExtension(filePath!, fileExtension);
    const objectMetadata = object;

    let originalFile = '';
    let remoteFile;
    try {
      originalFile = path.join(os.tmpdir(), filePath!);
      const tempLocalDir = path.dirname(originalFile);

      // Create the temp directory where the storage file will be downloaded.
      logs.tempDirectoryCreating(tempLocalDir);
      await mkdirp(tempLocalDir);
      logs.tempDirectoryCreated(tempLocalDir);

      // Download file from bucket.
      remoteFile = bucket.file(filePath!);
      logs.imageDownloading(filePath!);
      await remoteFile.download({ destination: originalFile });
      logs.imageDownloaded(filePath!, originalFile);

      // Get a unique list of image types
      const imageTypes = new Set(config.imageTypes);

      // Convert to a set to remove any duplicate sizes
      // const imageSizes = new Set(config.imageSizes);
      // object.metadata

      const tasks: Promise<any>[] = [];

      imageTypes.forEach((format) => {
        tasks.push(
          modifyImage({
            bucket,
            originalFile,
            fileDir,
            fileNameWithoutExtension,
            fileExtension,
            contentType,
            objectMetadata: objectMetadata,
            format,
          }),
        );
      });

      const results = await Promise.all(tasks);

      const failed = results.some((result) => result.success === false);
      if (failed) {
        logs.failed();
        return;
      } else {
        if (config.deleteOriginalFile === deleteImage.onSuccess) {
          if (remoteFile) {
            try {
              logs.remoteFileDeleting(filePath!);
              await remoteFile.delete();
              logs.remoteFileDeleted(filePath!);
            } catch (err) {
              logs.errorDeleting(err);
            }
          }
        }
        logs.complete();
      }
    } catch (err) {
      logs.error(err);
    } finally {
      if (originalFile) {
        logs.tempOriginalFileDeleting(filePath!);
        fs.unlinkSync(originalFile);
        logs.tempOriginalFileDeleted(filePath!);
      }
      if (config.deleteOriginalFile === deleteImage.always) {
        // Delete the original file
        if (remoteFile) {
          try {
            logs.remoteFileDeleting(filePath!);
            await remoteFile.delete();
            logs.remoteFileDeleted(filePath!);
          } catch (err) {
            logs.errorDeleting(err);
          }
        }
      }
    }
  });
