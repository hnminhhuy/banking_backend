import { ConfigService } from '@nestjs/config';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { initApplication } from './app';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await initApplication();
  const port = app.get(ConfigService).get<number>('app.port') || 3000;
  console.log(`Listen at port: ${port}`);
  process.on('unhandledRejection', (error) => {
    console.error(error);
  });

  await app.listen(port);
}

bootstrap();
