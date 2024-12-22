import { registerAs } from '@nestjs/config';

export default registerAs('another_bank', () => ({
  apiUrl: process.env.ANOTHER_BANK_API_URL,
  auth: {
    url: process.env.ANOTHER_BANK_AUTH_URL,
    refreshUrl: process.env.ANOTHER_BANK_REFRESH_URL,
    clientId: process.env.ANOTHER_BANK_CLIENT_ID,
    clientSecret: process.env.ANOTHER_BANK_CLIENT_SECRET,
  },
}));
