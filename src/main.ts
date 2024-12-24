import { ConfigService } from '@nestjs/config';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { initApplication } from './app';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await initApplication();

  app.enableCors({
    origin: ['http://localhost:5173', 'http://10.66.53.204:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = app.get(ConfigService).get<number>('app.port') || 3000;
  console.log(`Listen at port: ${port}`);
  process.on('unhandledRejection', (error) => {
    console.error(error);
  });

  await app.listen(port);
}

bootstrap();
