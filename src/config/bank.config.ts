import { registerAs } from '@nestjs/config';

export default registerAs('bank', () => ({
  default: {
    code: process.env.BANK_DEFAULT_CODE,
  },
  external_bank: {
    code: process.env.EXTERNAL_BANK_CODE,
  },
}));
