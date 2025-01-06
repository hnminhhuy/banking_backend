import { Injectable } from '@nestjs/common';
import { NotificationIRepo } from '../../repositories/notification.irepo';

@Injectable()
export class MarkAsReadNotificationUsecase {
  constructor(private readonly notificationRepo: NotificationIRepo) {}

  async execute(userId: string): Promise<void> {
    await this.notificationRepo.markAsRead(userId);
  }
}
