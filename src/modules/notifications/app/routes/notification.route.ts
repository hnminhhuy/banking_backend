import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from '../../../../decorators';
import { UserRole } from '../../../user/core/enums/user_role';
import { NotificationDto } from '../dto/notificarion.dto';
import { NotificationPageResponseModel } from '../../core/models/notification_page_response.model';
import { BooleanModel } from 'src/modules/user/core/models/user.model';
import { NotificationCountModel } from '../../core/models/notification.model';

export const NotificationRoute = {
  listNotification: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      query: NotificationDto,
      responses: [
        { status: HttpStatus.OK, type: NotificationPageResponseModel },
      ],
    },
  },

  markAsRead: <IRouteParams>{
    path: '/read',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [{ status: HttpStatus.OK, type: BooleanModel }],
    },
  },

  countUnread: <IRouteParams>{
    path: '/unreads/count',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [{ status: HttpStatus.OK, type: NotificationCountModel }],
    },
  },
};
