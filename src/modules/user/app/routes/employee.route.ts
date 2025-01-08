import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import { UserMeModel, UserModel } from '../../core/models/user.model';
import { BaseException } from 'src/exceptions';
import { UserEmployeePageResponseModel } from '../../core/models/user_page_response.model';

export default {
  createCustomer: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Employee],
    swaggerParams: {
      responses: [
        { status: HttpStatus.CREATED, type: UserModel },
        { status: HttpStatus.BAD_REQUEST, type: BaseException },
      ],
    },
  },
  listCustomer: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Employee],
    swaggerParams: {
      responses: [
        { status: HttpStatus.CREATED, type: UserEmployeePageResponseModel },
        { status: HttpStatus.BAD_REQUEST, type: BaseException },
      ],
    },
  },
  getMe: <IRouteParams>{
    path: '/me',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Employee],
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: UserMeModel },
        { status: HttpStatus.BAD_REQUEST, type: BaseException },
      ],
    },
  },
};
