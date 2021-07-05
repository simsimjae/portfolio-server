import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AllExceptionFilter } from './common/filters/exception.filter';
import { AppModule } from './modules/app.module';
import cluster from 'cluster';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 데코레이터 붙어있는것만 허용
      forbidNonWhitelisted: true,
      transform: true, // 요청에서 넘어온 자료들의 형변환
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());

  // 배포 관련
  let isDisableKeepAlive = false;
  app.use(function (req, res, next) {
    if (isDisableKeepAlive) {
      res.set('Connection', 'close');
    }
    next();
  });
  await app.listen(4000);
  console.log('application is listening on port 4000');
  if (cluster.isWorker) {
    process.send('ready');
    process.on('SIGINT', async () => {
      console.log('SIGINT.');
      isDisableKeepAlive = true;
      await app.close();
      process.exit(0);
    });
  }
}
bootstrap();
