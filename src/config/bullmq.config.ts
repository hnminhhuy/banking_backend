import { registerAs } from '@nestjs/config';

export default registerAs('bullmq', () => ({
  db: process.env.BULLMQ_REDIS_PORT,
}));
