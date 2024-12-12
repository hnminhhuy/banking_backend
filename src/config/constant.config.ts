import { registerAs } from '@nestjs/config';

export default registerAs('constant', () => ({
  bankAccountStart: process.env.BANK_ACCOUNT_START,
}));
