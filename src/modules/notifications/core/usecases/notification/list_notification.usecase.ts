import { Injectable } from '@nestjs/common';
import { NotificationIRepo } from '../../repositories/notification.irepo';
import { NotificationModel } from '../../models/notification.model';

@Injectable()
export class ListNotificationUsecase {
  constructor(private readonly notificationRepo: NotificationIRepo) {}

  public async execute(userId: string): Promise<NotificationModel[]> {
    return await this.notificationRepo.list(userId);
  }
}
