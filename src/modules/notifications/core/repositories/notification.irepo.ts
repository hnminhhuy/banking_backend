import { Page, PageParams, SortParams } from '../../../../common/models';
import { NotificationSort } from '../enums/notification_sort';
import { NotificationType } from '../enums/notification_type';
import { NotificationModel } from '../models/notification.model';

export abstract class NotificationIRepo {
  abstract create(notification: NotificationModel): Promise<void>;
  abstract list(
    pageParams: PageParams,
    sortParams: SortParams<NotificationSort>,
    userId: string,
    type: NotificationType | undefined,
  ): Promise<Page<NotificationModel>>;

  abstract markAsRead(userId: string): Promise<void>;
  abstract countUnread(userId: string): Promise<number>;
}
