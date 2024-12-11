import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  enabled: process.env.SWAGGER_ENABLED === 'true' || false,
  title: process.env.SWAGGER_TITLE,
  description: process.env.SWAGGER_DESCRIPTION,
  path: process.env.SWAGGER_PATH,
  version: process.env.SWAGGER_VERSION,
}));
