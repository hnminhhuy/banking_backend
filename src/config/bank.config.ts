import { registerAs } from '@nestjs/config';

export default registerAs('bank', () => ({
  default: {
    code: process.env.BANK_DEFAULT_CODE,
  },
  another_bank: {
    code: process.env.ANOTHER_BANK_CODE,
  },
}));
