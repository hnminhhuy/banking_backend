import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import {
  LoginResponseModel,
  RefreshAccessTokenResponseModel,
  RequestPasswordResetResponseModel,
  VerifyOtpResponseModel,
} from '../../core/models/oauth_token.model';
import { BooleanModel } from 'src/modules/user/core/models/user.model';

export default {
  login: <IRouteParams>{
    path: '/login',
    method: RequestMethod.POST,
    secure: false,
    swaggerParams: {
      responses: [{ status: HttpStatus.OK, type: LoginResponseModel }],
    },
  },
  refreshAccessToken: <IRouteParams>{
    path: '/refresh-access',
    method: RequestMethod.POST,
    secure: false,
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: RefreshAccessTokenResponseModel },
      ],
    },
  },
  requestPasswordReset: <IRouteParams>{
    path: '/request-reset-password',
    method: RequestMethod.POST,
    secure: false,
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: RequestPasswordResetResponseModel },
      ],
    },
  },
  verifyOtp: <IRouteParams>{
    path: '/otp-verify',
    method: RequestMethod.POST,
    secure: false,
    swaggerParams: {
      responses: [{ status: HttpStatus.OK, type: VerifyOtpResponseModel }],
    },
  },
  resetPassword: <IRouteParams>{
    path: 'reset-password',
    method: RequestMethod.POST,
    secure: true,
    swaggerParams: {
      responses: [{ status: HttpStatus.OK, type: BooleanModel }],
    },
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
