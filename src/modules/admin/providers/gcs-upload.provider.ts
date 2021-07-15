import { UploadedFile } from 'admin-bro';
import { UploadResponse, DeleteFileResponse } from '@google-cloud/storage';
import { BaseProvider } from '@admin-bro/upload';

export const DAY_IN_MINUTES = 86400;

export type GCPOptions = {
  /**
   * Google Storage Bucket name, where files will be stored
   */
  bucket: string;
  /**
   * indicates how long links should be available after page load (in minutes).
   * Default to 24h. If set to 0 adapter will mark uploaded files as public.
   */
  expires?: number;
};

/** Dropzone을 통한 이미지 업로드 */
export class GCPProvider extends BaseProvider {
  private storage: Storage;
  public expires: number;

  constructor(options: GCPOptions) {
    super(options.bucket);

    let GCPStorage: typeof Storage;
    try {
      // eslint-disable-next-line
      GCPStorage = require('@google-cloud/storage').Storage;
    } catch (error) {
      throw new Error('You have to install "@google-cloud/storage" in order to run this plugin with GCP');
    }
    // // this check is needed because option expires can be `0`
    this.expires = typeof options.expires === 'undefined' ? DAY_IN_MINUTES : options.expires;
    this.storage = new GCPStorage();
  }

  public async upload(file: UploadedFile, key: string): Promise<UploadResponse> {
    return this.storage.bucket(this.bucket).upload(file.path, {
      gzip: false,
      destination: `${key.split('.')[0]}.webp`,
      predefinedAcl: this.expires === 0 ? 'publicRead' : 'private',
    });
  }

  public async delete(key: string, bucket: string): Promise<DeleteFileResponse> {
    const gcpBucket = this.storage.bucket(bucket);
    const file = gcpBucket.file(key);
    return file.delete();
  }

  public async path(key: string, bucket: string): Promise<string> {
    const gcpBucket = this.storage.bucket(bucket);
    const file = gcpBucket.file(key);

    if (this.expires) {
      const files = await file.getSignedUrl({
        action: 'read',
        expires: new Date().valueOf() + this.expires * 1000,
      });
      return files[0];
    }
    // https://cloud.google.com/storage/docs/access-public-data#api-link
    return `https://storage.googleapis.com/${bucket}/${key}`;
  }
}
