import { Controller, Query, Req } from '@nestjs/common';
import { ListNotificationUsecase } from '../../core/usecases/notification/list_notification.usecase';
import { Route } from '../../../../decorators';
import { NotificationRoute } from '../routes/notification.route';
import { NotificationDto } from '../dto/notificarion.dto';
import { PageParams, SortParams } from '../../../../common/models';
import { NotificationSort } from '../../core/enums/notification_sort';
import { MarkAsReadNotificationUsecase } from '../../core/usecases/notification/mark_as_read_notification.usecase';
import { CountUnreadNotificationUsecase } from '../../core/usecases/notification/count_unread_notification.usecase';

@Controller({ path: 'api/customer/v1/notifications' })
export class NotificationController {
  constructor(
    private readonly listNotificationUsecase: ListNotificationUsecase,
    private readonly markAsReadNotificationUsecase: MarkAsReadNotificationUsecase,
    private readonly countUnreadNotificationUsecase: CountUnreadNotificationUsecase,
  ) {}

  @Route(NotificationRoute.listNotification)
  async listNotification(@Req() req: any, @Query() query: NotificationDto) {
    const pageParams = new PageParams(query.page, query.limit, true, false);

    const sortParams: SortParams<NotificationSort> = new SortParams(
      NotificationSort.CreatedAt,
      'desc',
    );

    const notifications = await this.listNotificationUsecase.execute(
      pageParams,
      sortParams,
      req.user.authId,
      query.type,
    );

    return {
      data: notifications.data,
      metadata: {
        page: notifications.page,
        totalCount: notifications.totalCount,
      },
    };
  }

  @Route(NotificationRoute.markAsRead)
  async markAsRead(@Req() req: any) {
    await this.markAsReadNotificationUsecase.execute(req.user.authId);
    return true;
  }

  @Route(NotificationRoute.countUnread)
  async countUnread(@Req() req: any) {
    const count = await this.countUnreadNotificationUsecase.execute(
      req.user.authId,
    );
    return count;
  }
}
