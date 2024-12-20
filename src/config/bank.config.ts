import { registerAs } from '@nestjs/config';

export default registerAs('bank', () => ({
  default: {
    code: process.env.BANK_DEFAULT_CODE,
    name: process.env.BANK_DEFAULT_NAME,
    shortName: process.env.BANK_DEFAULT_SHORT_NAME,
    logoUrl: process.env.BANK_DEFAULT_LOGO_URL,
  },
}));
