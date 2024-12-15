import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { UserRole } from '../../core/enums/user_role';
import { UserModel } from '../../core/models/user.model';
import { BaseException } from 'src/exceptions';

export default {
  getMe: <IRouteParams>{
    path: '/me',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
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
};
