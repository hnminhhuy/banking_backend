import { BootstrapConsole } from 'nestjs-console';
import { AppModule } from './app/app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true,
});
initializeTransactionalContext();

bootstrap.init().then(async (app) => {
  try {
    await app.init();
    await bootstrap.boot();
    await app.close();
    process.exit(0);
  } catch (error) {
    console.log(error);
    await app.close();
    process.exit(1);
  }
});
