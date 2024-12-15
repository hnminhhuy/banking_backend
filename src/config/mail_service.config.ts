import { registerAs } from '@nestjs/config';

export default registerAs('mail_service', () => ({
  mail: process.env.MAIL_SERVICE_MAIL,
  clientId: process.env.MAIL_SERVICE_CLIENT_ID,
  clientSecret: process.env.MAIL_SERVICE_CLIENT_SECRET,
  redirectUri: process.env.MAIL_SERVICE_REDIRECT_URI,
  refreshToken: process.env.MAIL_SERVICE_REFRESH_TOKEN,
}));
