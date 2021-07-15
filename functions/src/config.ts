/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export enum deleteImage {
  always = 0,
  never,
  onSuccess,
}

function deleteOriginalFile(deleteType: any) {
  switch (deleteType) {
    case 'true':
      return deleteImage.always;
    case 'false':
      return deleteImage.never;
    default:
      return deleteImage.onSuccess;
  }
}

function paramToArray(param: any) {
  return typeof param === 'string' ? param.split(',') : undefined;
}

export default {
  bucket: process.env.GCP_BUCKET_NAME,
  cacheControlHeader: 'public, max-age=31536000',
  resizedImagesPath: process.env.RESIZED_IMAGES_PATH,
  includePathList: paramToArray(undefined),
  excludePathList: paramToArray(undefined),
  deleteOriginalFile: deleteOriginalFile('false'),
  imageTypes: paramToArray('webp'),
};
