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

  const origins = configService.get<string>('CORS_ORIGINS', '');
  console.log('origin', origins);

  app.enableCors({
    origin: origins.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await configAppInterceptor(app);
  await configAppException(app);
  await configAppDocument(app, configService);

  return app;
};
