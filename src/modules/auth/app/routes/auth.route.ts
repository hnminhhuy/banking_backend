import { RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';

export default {
  login: <IRouteParams>{
    path: '/login',
    method: RequestMethod.POST,
    secure: false,
  },
  refreshAccessToken: <IRouteParams>{
    path: '/refresh-access',
    method: RequestMethod.POST,
    secure: false,
  },
  requestPasswordReset: <IRouteParams>{
    path: '/request-reset-password',
    method: RequestMethod.POST,
    secure: false,
  },
  verifyOtp: <IRouteParams>{
    path: '/otp-verify',
    method: RequestMethod.POST,
    secure: false,
  },
  resetPassword: <IRouteParams>{
    path: 'reset-password',
    method: RequestMethod.POST,
    secure: true,
  },
  oauthToken: <IRouteParams>{
    path: 'oauth/token',
    method: RequestMethod.POST,
    secure: false,
  },
  refreshOAuthToken: <IRouteParams>{
    path: 'oauth/token/refresh',
    method: RequestMethod.POST,
  },
};
