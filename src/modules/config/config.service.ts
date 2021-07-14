import { Injectable } from '@nestjs/common';
import Joi from '@hapi/joi';
import { validationSchema } from './config.module';
import { ConfigService as NestConfigService } from '@nestjs/config';
import 'joi-extract-type';

type configType = Joi.extractType<typeof validationSchema>;

@Injectable()
export class ConfigService extends NestConfigService {
  get(key: keyof configType): string {
    return this.get(key);
  }

  getPublicUrl(fileName: string) {
    return `https://storage.googleapis.com/${this.get('GCP_BUCKET_NAME')}/${this.get('GCP_BUCKET_PATH')}/${fileName}`;
  }
}
