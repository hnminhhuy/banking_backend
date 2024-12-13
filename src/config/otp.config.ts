import { registerAs } from '@nestjs/config';

export default registerAs('otp', () => ({
  clientId: process.env.OTP_CLIENT_ID,
  clientSecret: process.env.OTP_CLIENT_SECRET,
  redirectUri: process.env.OTP_REDIRECT_URI,
  refreshToken: process.env.OTP_REFRESH_TOKEN,
}));
