import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configAppDocument = async (
  app: INestApplication,
  configService: ConfigService,
): Promise<void> => {
  if (!configService.get<boolean>('swagger.enabled')) {
    return;
  }
  const title = configService.get<string>('swagger.title');
  const description = configService.get<string>('swagger.description');
  const version = configService.get<string>('swagger.version');
  const path = configService.get<string>('swagger.path');

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(path, app, document);
};
