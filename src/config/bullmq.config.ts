import { registerAs } from '@nestjs/config';

export default registerAs('bullmq', () => ({
  db: process.env.BULLMQ_REDIS_PORT,
  transactionQueue: process.env.BULLMQ_TRANSACTION_QUEUE,
}));
