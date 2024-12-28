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
  jwtRefreshTokenExpired: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  hashKey: process.env.AUTH_HASH_KEY,
}));
