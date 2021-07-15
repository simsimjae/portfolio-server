import uploadFeature from '@admin-bro/upload';
import { ResourceOptions } from 'admin-bro';
import { uid } from 'uid';
import { PortfolioImage } from '../../../modules/portfolios/entities/portfolioImage.entity';
import { GCPProvider } from '../providers/gcs-upload.provider';

export const PortfolioImageResource = (bucket, path) => {
  const gcpProvider = new GCPProvider({
    bucket,
    expires: 0,
  });

  return {
    resource: PortfolioImage,
    options: {
      editProperties: ['type', 'image.file', 'PORTFOLIO_ID'],
    } as ResourceOptions,
    features: [
      uploadFeature({
        properties: {
          file: 'image.file',
          filePath: 'url',
          filename: 'image.filename',
          filesToDelete: 'image.toDelete',
          // db field name
          key: 'key',
          bucket: 'bucket',
        },
        provider: gcpProvider,
        validation: { mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
        uploadPath: (record, filename) => `${path}/${uid(10)}`,
      }),
    ],
  };
};
