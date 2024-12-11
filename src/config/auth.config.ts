import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    publicKey: process.env.JWT_PUBLIC_KEY,
    privateKey: process.env.JWT_PRIVATE_KEY,
    signOptions: {
      algorithm: process.env.JWT_ALGORITHM,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    },
  },
  jwtRefreshToken: process.env.JWT_RERESH_TOKEN_EXPIRES_IN,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    authorizationUri: process.env.GOOLE_AUTHORIZATION_URI,
    scope: process.env.GOOGLE_SCOPE,
    userInfoUri: process.env.GOOGLE_USER_INFO,
  },
}));
