import { registerAs } from '@nestjs/config';

export default registerAs('constant', () => ({
  bankAccountStart: process.env.START_BANK_ACCOUNT_NUMBER,
}));
