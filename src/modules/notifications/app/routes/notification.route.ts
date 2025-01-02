import { RequestMethod } from '@nestjs/common';
import { IRouteParams } from '../../../../decorators';
import { UserRole } from '../../../user/core/enums/user_role';
import { NotificationDto } from '../dto/notificarion.dto';

export const NotificationRoute = {
  listNotification: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      query: NotificationDto,
    },
  },
};
