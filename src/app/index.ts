import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { configAppInterceptor } from './app.interceptor';
import { configAppException } from './app.exception';
import { configAppDocument } from './app.document';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

export const initApplication = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule, { abortOnError: true });

  const configService = app.get(ConfigService);

  await configAppInterceptor(app);
  await configAppException(app);
  await configAppDocument(app, configService);

  return app;
};
