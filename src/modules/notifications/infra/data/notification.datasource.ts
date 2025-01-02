import { Injectable } from '@nestjs/common';
import { NotificationEntity } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { NotificationModel } from '../../core/models/notification.model';
import { Page, PageParams, SortParams } from '../../../../common/models';
import { NotificationSort } from '../../core/enums/notification_sort';
import { NotificationType } from '../../core/enums/notification_type';
import { TransactionModel } from '../../../transactions/core/models/transaction.model';
import { TransactionEntity } from '../../../transactions/infra/data/entities/transaction.entity';

@Injectable()
export class NotificationDatasource {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async create(notification: NotificationModel): Promise<void> {
    const newFcmToken = this.notificationRepository.create(notification);
    await this.notificationRepository.insert(newFcmToken);
  }

  async list(
    pageParams: PageParams,
    sortParams: SortParams<NotificationSort>,
    userId: string,
    type: NotificationType | undefined,
  ): Promise<Page<NotificationModel>> {
    const conditions: FindOptionsWhere<NotificationEntity> = {};
    const orderBy: FindOptionsOrder<TransactionEntity> = {};

    if (sortParams) {
      orderBy[sortParams.sort] = sortParams.direction;
    }

    if (type) {
      conditions['type'] = type;
    }

    if (userId) {
      conditions['userId'] = userId;
    }

    const query = this.notificationRepository.createQueryBuilder();

    query.setFindOptions({
      where: conditions,
      skip: pageParams.limit * (pageParams.page - 1),
      take: pageParams.limit,
      order: orderBy,
    });

    let totalCount = 0;
    let items: NotificationEntity[] = [];
    if (pageParams.needTotalCount) {
      totalCount = await query.getCount();
    }

    if (!pageParams.onlyCount) {
      items = await query.getMany();
    }

    const notifications = items.map(
      (notification) => new NotificationModel(notification),
    );

    return new Page(pageParams.page, totalCount, notifications);
  }
}
