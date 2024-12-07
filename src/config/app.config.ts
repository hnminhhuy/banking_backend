import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  port: parseInt(process.env.APP_PORT),
  env: process.env.NODE_ENV,
  debug: process.env.APP_DEBUG === 'true',
  version: process.env.APP_VERSION,
}));
