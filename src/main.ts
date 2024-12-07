import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { setupSwagger } from './common/helpers/setup_swagger.helper';
import { ConfigService } from '@nestjs/config';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  // Initialize the transactional context to manage database transactions
  // Ensures that each request's database operations are committed or rolled back properly
  initializeTransactionalContext();

  // Create the NestJS application instance using the root module (AppModule)
  // The abortOnError option ensures the app initialization stops if any error occurs
  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
  });

  // Retrieve the application port from the configuration service
  // Defaults to 3000 if the port is not configured
  const port = app.get(ConfigService).get<number>('app.port') || 3000;

  // Enable API versioning, allowing support for multiple versions of endpoints (e.g., /v1, /v2)
  app.enableVersioning();

  // Configure Swagger for API documentation
  // This generates an interactive interface for testing and understanding the APIs
  await setupSwagger(app);

  // Add a global handler for unhandled promise rejections
  // Logs errors to the console to prevent the application from crashing silently
  process.on('unhandledRejection', (error) => {
    console.error(error);
  });

  // Start the application and listen on the specified port
  // If no port is provided in the configuration, default to 3000
  await app.listen(port);
}

// Call the bootstrap function to initialize and start the application
bootstrap();
