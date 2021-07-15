import { ConfigService } from '../config/config.service';
import { MulterModule as NestMulterModule } from '@nestjs/platform-express';
import { BadRequestException, Module } from '@nestjs/common';
import MulterGoogleCloudStorage from 'multer-cloud-storage';

/** 에디터 내에서 업로드 되는 이미지를 처리합니다. */
export const MulterModule = NestMulterModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    fileFilter: (request, file, callback) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('지원하지 않는 이미지 형식입니다.'), false);
      }
    },
    storage: new MulterGoogleCloudStorage({
      projectId: configService.get('GCP_PROJECT_ID'),
      bucket: configService.get('GCP_BUCKET_NAME'),
      destination: configService.get('GCP_BUCKET_PATH'),
      credentials: require(configService.get('GOOGLE_APPLICATION_CREDENTIALS')),
      acl: 'publicRead',
      filename: (req, file, cb) => cb(null, `${file.fieldname}-${Date.now()}`),
    }),
  }),
});
