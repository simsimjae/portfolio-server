import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  ADMIN_EMAIL: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  COOKIE_DOMAIN: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().required(),
  KAKAO_APPKEY: Joi.string().required(),
  KAKAO_CLIENT_ID: Joi.string().required(),
  KAKAO_CLIENT_SECRET: Joi.string().required(),
  KAKAO_CALLBACK_URL: Joi.string().required(),
  NAVER_CLIENT_ID: Joi.string().required(),
  NAVER_CLIENT_SECRET: Joi.string().required(),
  NAVER_CALLBACK_URL: Joi.string().required(),
  GOOGLE_APPLICATION_CREDENTIALS: Joi.string().required(),
  GCP_PROJECT_ID: Joi.string().required(),
  GCP_BUCKET_NAME: Joi.string().required(),
  GCP_BUCKET_PATH: Joi.string().required(),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env.test', '.env.prod'],
      validationSchema,
    }),
  ],
  providers: [ConfigService],
})
export class ConfigModule {}
