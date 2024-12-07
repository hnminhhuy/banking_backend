import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const { PG_LOGGING, PG_DATABASE, PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD } =
  process.env;

export const pgDataSource = new DataSource({
  type: 'postgres',
  logging: PG_LOGGING === 'true' ? true : false,
  database: PG_DATABASE,
  host: PG_HOST,
  port: parseInt(PG_PORT),
  username: PG_USERNAME,
  password: PG_PASSWORD,
  migrations: ['dist/src/migrations/*.js'],
});
