import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import {
  BooleanModel,
  CreateUserResponseModel,
  UserMeModel,
  UserModel,
} from '../../core/models/user.model';
import { BaseException } from 'src/exceptions';
import { UserPageResponseModel } from '../../core/models/user_page_response.model';

export default {
  createEmployee: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      responses: [
        { status: HttpStatus.CREATED, type: CreateUserResponseModel },
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
        { status: HttpStatus.OK, type: UserPageResponseModel },
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
        { status: HttpStatus.OK, type: UserMeModel },
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
    swaggerParams: {
      responses: [{ status: HttpStatus.OK, type: BooleanModel }],
    },
  },
  unblockUser: <IRouteParams>{
    path: 'unblock/:id',
    method: RequestMethod.PATCH,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      responses: [{ status: HttpStatus.OK, type: BooleanModel }],
    },
  },
};
