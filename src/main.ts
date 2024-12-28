import { ConfigService } from '@nestjs/config';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { initApplication } from './app';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await initApplication();

  const configService = app.get(ConfigService);

  const origins = configService.get<string>('CORS_ORIGINS', '');
  console.log('origin', origins);

  app.enableCors({
    origin: origins.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = app.get(ConfigService).get<number>('app.port') || 3000;
  console.log(`Listen at port: ${port}`);
  process.on('unhandledRejection', (error) => {
    console.error(error);
  });

  await app.listen(port);
}

bootstrap();
