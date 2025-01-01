import { Injectable } from '@nestjs/common';
import { NotificationIRepo } from '../../../core/repositories/notification.irepo';
import { NotificationDatasource } from '../notification.datasource';
import { NotificationModel } from '../../../core/models/notification.model';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationRepo implements NotificationIRepo {
  constructor(
    private readonly notificationDatasource: NotificationDatasource,
  ) {}
  async create(notification: NotificationModel): Promise<void> {
    await this.notificationDatasource.create(notification);
  }
  async list(userId: string): Promise<NotificationModel[]> {
    const notifications =
      await this.notificationDatasource.findAllByUserId(userId);

    return notifications.map(
      (notification) => new NotificationModel(notification),
    );
  }
}
