import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB) || 0,
  tls:
    process.env.REDIS_TLS === 'true'
      ? {
          rejectUnauthorized: true,
        }
      : undefined, // Optional TLS configuration
  logging: process.env.REDIS_LOGGING === 'true', // Enable logging if needed
}));
