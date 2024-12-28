import { registerAs } from '@nestjs/config';

export default registerAs('external_bank', () => ({
  apiUrl: process.env.EXTERNAL_BANK_API_URL,
  auth: {
    url: process.env.EXTERNAL_BANK_AUTH_URL,
    refreshUrl: process.env.EXTERNAL_BANK_REFRESH_URL,
    clientId: process.env.EXTERNAL_BANK_CLIENT_ID,
    clientSecret: process.env.EXTERNAL_BANK_CLIENT_SECRET,
  },
}));
