import { Controller, Query, Req } from '@nestjs/common';
import { ListNotificationUsecase } from '../../core/usecases/notification/list_notification.usecase';
import { Route } from '../../../../decorators';
import { NotificationRoute } from '../routes/notification.route';
import { NotificationDto } from '../dto/notificarion.dto';
import { PageParams, SortParams } from '../../../../common/models';
import { NotificationSort } from '../../core/enums/notification_sort';

@Controller({ path: 'api/customer/v1/notifications' })
export class NotificationController {
  constructor(
    private readonly listNotificationUsecase: ListNotificationUsecase,
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
}
