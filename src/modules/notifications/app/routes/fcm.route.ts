import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { BaseException } from 'src/exceptions';
import { UserRole } from '../../../user/core/enums/user_role';

export const FcmRoute = {
  sendNotification: <IRouteParams>{
    path: '/send-notification',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [
        {
          status: HttpStatus.OK,
          description: 'Notification sent successfully',
        },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Validation failed',
          type: BaseException,
        },
        {
          status: HttpStatus.UNAUTHORIZED,
          type: BaseException,
          description: 'Authentication required',
        },
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          description: 'Unexpected server error',
          type: BaseException,
        },
      ],
    },
  },
  sendMultipleNotifications: <IRouteParams>{
    path: '/send-multiple-notifications',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [
        {
          status: HttpStatus.OK,
          description: 'Notifications sent successfully',
        },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Validation failed',
          type: BaseException,
        },
        {
          status: HttpStatus.UNAUTHORIZED,
          type: BaseException,
          description: 'Authentication required',
        },
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          description: 'Unexpected server error',
          type: BaseException,
        },
      ],
    },
  },
  sendTopicNotification: <IRouteParams>{
    path: '/send-topic-notification',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [
        {
          status: HttpStatus.OK,
          description: 'Topic notification sent successfully',
        },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Validation failed',
          type: BaseException,
        },
        {
          status: HttpStatus.UNAUTHORIZED,
          type: BaseException,
          description: 'Authentication required',
        },
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          description: 'Unexpected server error',
          type: BaseException,
        },
      ],
    },
  },
};
