import { Injectable } from '@nestjs/common';
import { NotificationEntity } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationModel } from '../../core/models/notification.model';

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

  async findAllByUserId(userId: string): Promise<NotificationEntity[]> {
    return this.notificationRepository.find({ where: { userId: userId } });
  }
}
