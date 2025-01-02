import { Injectable } from '@nestjs/common';
import { NotificationIRepo } from '../../../core/repositories/notification.irepo';
import { NotificationDatasource } from '../notification.datasource';
import { NotificationModel } from '../../../core/models/notification.model';
import { NotificationEntity } from '../entities/notification.entity';
import { Page, PageParams, SortParams } from '../../../../../common/models';
import { NotificationSort } from '../../../core/enums/notification_sort';
import { NotificationType } from '../../../core/enums/notification_type';

@Injectable()
export class NotificationRepo implements NotificationIRepo {
  constructor(
    private readonly notificationDatasource: NotificationDatasource,
  ) {}
  async create(notification: NotificationModel): Promise<void> {
    await this.notificationDatasource.create(notification);
  }
  async list(
    pageParams: PageParams,
    sortParams: SortParams<NotificationSort>,
    userId: string,
    type: NotificationType | undefined,
  ): Promise<Page<NotificationModel>> {
    return this.notificationDatasource.list(
      pageParams,
      sortParams,
      userId,
      type,
    );
  }
}
