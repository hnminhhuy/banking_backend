import { RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';

export default {
  login: <IRouteParams>{
    path: '/login',
    method: RequestMethod.POST,
    secure: false,
  },
  refreshAccessToken: <IRouteParams>{
    path: '/refresh_access',
    method: RequestMethod.POST,
    secure: false,
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
