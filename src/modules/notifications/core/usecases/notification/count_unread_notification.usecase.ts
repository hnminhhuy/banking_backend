import { Injectable } from '@nestjs/common';
import { NotificationIRepo } from '../../repositories/notification.irepo';

@Injectable()
export class CountUnreadNotificationUsecase {
  constructor(private readonly notificationRepo: NotificationIRepo) {}

  async execute(userId: string): Promise<number> {
    return await this.notificationRepo.countUnread(userId);
  }
}
