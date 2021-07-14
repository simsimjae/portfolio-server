import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import MulterGoogleCloudStorage from 'multer-cloud-storage';
import serviceAccount from './serviceAccount';

const bucket = 'archive-319715.appspot.com';
const destination = 'portfolios/images';

export const getPublicUrl = (fileName: string) => {
  return `https://storage.googleapis.com/${bucket}/${destination}/${fileName}`;
};

export const multerOptions: MulterOptions = {
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      callback(null, true);
    } else {
      callback(new BadRequestException('지원하지 않는 이미지 형식입니다.'), false);
    }
  },
  storage: new MulterGoogleCloudStorage({
    projectId: 'archive-319715',
    bucket: bucket,
    credentials: serviceAccount,
    acl: 'publicRead',
    destination: destination,
    filename: (req, file, cb) => {
      const fileNameSplit = file.originalname.split('.');
      const fileExt = fileNameSplit.pop();
      cb(null, `${Date.now()}.${fileExt}`);
    },
  }),
};
