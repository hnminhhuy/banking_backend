import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { UserRole } from '../../core/enums/user_role';
import { UserMeModel, UserModel } from '../../core/models/user.model';
import { BaseException } from 'src/exceptions';
import { DashboardInfoResponseModel } from '../../core/models/dashboard_response.model';

export default {
  getMe: <IRouteParams>{
    path: '/me',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
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
  getDashboardInfo: <IRouteParams>{
    path: '/dashboard/info',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: DashboardInfoResponseModel },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
      ],
    },
  },
};
