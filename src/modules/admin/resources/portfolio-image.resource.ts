import uploadFeature from '@admin-bro/upload';
import { ResourceOptions } from 'admin-bro';
import { PortfolioImage } from '../../../modules/portfolios/entities/portfolioImage.entity';
import FileUtils from '../components/Editor/utils/FileUtils';

export const PortfolioImageResource = (bucket, path) => ({
  resource: PortfolioImage,
  options: {
    editProperties: ['type', 'image.file', 'PORTFOLIO_ID'],
    actions: {
      edit: {
        new: {
          before: async (request) => {
            const compressedFile = await FileUtils.compressFile(request.image.file);
            request.image.file = compressedFile;
            return request;
          },
        },
      },
    },
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
        size: 'size',
        mimeType: 'mimeType',
        bucket: 'bucket',
      },
      provider: {
        gcp: {
          bucket,
          expires: 0,
        },
      },
      validation: { mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
      uploadPath: (record, filename) => `${path}/${Date.now()}.${filename.split('.').pop()}`,
    }),
  ],
});
