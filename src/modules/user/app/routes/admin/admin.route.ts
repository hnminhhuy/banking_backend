import { RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';

export default {
  listUsers: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: false,
    swaggerParams: {},
  },
  createEmployee: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: false,
    swaggerParams: {},
  },
  updateUser: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.PATCH,
    secure: false,
    swaggerParams: {},
  },
  blockedUser: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.DELETE,
    secure: false,
    swaggerParams: {},
  },
};
