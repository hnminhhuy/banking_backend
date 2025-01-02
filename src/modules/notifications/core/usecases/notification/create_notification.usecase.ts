import { Injectable } from '@nestjs/common';
import { NotificationIRepo } from '../../repositories/notification.irepo';
import {
  NotificationModel,
  NotificationModelParams,
} from '../../models/notification.model';
import { NotificationType } from '../../enums/notification_type';
import { NotificationTitle } from '../../enums/notification_title';

@Injectable()
export class CreateNotificationUsecase {
  constructor(private readonly notificationRepo: NotificationIRepo) {}

  public async execute(
    params: NotificationModelParams,
  ): Promise<NotificationModel> {
    type createNotification = Pick<
      NotificationModelParams,
      'userId' | 'title' | 'body' | 'type'
    >;

    switch (params['type']) {
      case NotificationType.BALANCE_UPDATE:
        params['title'] = NotificationTitle.BALANCE_UPDATE;
        break;
      case NotificationType.DEBT_CREATED_FOR_YOU:
        params['title'] = NotificationTitle.DEBT_CREATED_FOR_YOU;
        break;
      case NotificationType.DEBT_PAID:
        params['title'] = NotificationTitle.DEBT_PAID;
        break;
      case NotificationType.DEBT_CANCEL:
        params['title'] = NotificationTitle.DEBT_CANCEL;
        break;
      default:
        throw new Error('Invalid notification type');
    }

    const newNotification = new NotificationModel(params as createNotification);

    await this.notificationRepo.create(newNotification);

    return newNotification;
  }
}
