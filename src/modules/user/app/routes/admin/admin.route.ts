import { RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { UserRole } from 'src/modules/user/core/enums/user_role';

export default {
  listUsers: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {},
  },
  createEmployee: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {},
  },
  updateUser: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.PATCH,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {},
  },
  blockedUser: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.DELETE,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {},
  },
};
