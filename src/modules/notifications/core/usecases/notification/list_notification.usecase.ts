import { Injectable } from '@nestjs/common';
import { NotificationIRepo } from '../../repositories/notification.irepo';
import { NotificationModel } from '../../models/notification.model';
import { Page, PageParams, SortParams } from '../../../../../common/models';
import { NotificationSort } from '../../enums/notification_sort';
import { NotificationType } from '../../enums/notification_type';

@Injectable()
export class ListNotificationUsecase {
  constructor(private readonly notificationRepo: NotificationIRepo) {}

  public async execute(
    pageParams: PageParams,
    sortParams: SortParams<NotificationSort>,
    userId: string,
    type: NotificationType | undefined,
  ): Promise<Page<NotificationModel>> {
    return await this.notificationRepo.list(
      pageParams,
      sortParams,
      userId,
      type,
    );
  }
}
