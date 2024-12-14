import { HttpStatus, RequestMethod } from '@nestjs/common';
import { Page } from 'src/common/models';
import { IRouteParams } from 'src/decorators';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import { UserModel } from '../../core/models/user.model';
import { BaseException } from 'src/exceptions';

export default {
  createEmployee: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      responses: [
        { status: HttpStatus.CREATED, type: UserModel },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
      ],
    },
  },
  listUsers: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: Page<UserModel> },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
      ],
    },
  },
  getUser: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      responses: [
        { status: HttpStatus.CREATED, type: UserModel },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
      ],
    },
  },
  getMe: <IRouteParams>{
    path: '/me',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: UserModel },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
      ],
    },
  },
  updateUser: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.PATCH,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: UserModel },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
      ],
    },
  },
  blockedUser: <IRouteParams>{
    path: 'block/:id',
    method: RequestMethod.PATCH,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {},
  },
};
