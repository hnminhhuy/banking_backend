import { RequestMethod } from '@nestjs/common';
import { IRouteParams } from '../../../../decorators';
import { UserRole } from '../../../user/core/enums/user_role';
import { FcmTokenDto } from '../dto/fcm_token.dto';

export const FcmRoute = {
  createFcmToken: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    roles: [UserRole.Customer],
    secure: true,
    swaggerParams: {
      body: FcmTokenDto,
    },
  },
  deleteFcmToken: <IRouteParams>{
    path: '/:token',
    method: RequestMethod.DELETE,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      param: FcmTokenDto,
    },
  },
};
