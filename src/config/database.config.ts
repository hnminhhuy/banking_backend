import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  postgres: {
    connect: process.env.PG_CONNECT,
    type: process.env.PG_TYPE,
    logging: process.env.PG_LOGGING === 'true' ? true : false,
    synchronize: false,
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  },
}));
