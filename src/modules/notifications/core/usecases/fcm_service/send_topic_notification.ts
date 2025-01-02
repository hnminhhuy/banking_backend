import { Injectable } from '@nestjs/common';
import { FcmServiceIRepo } from '../../repositories/fcm_service.irepo';

@Injectable()
export class SendTopicNotification {
  constructor(private readonly fcmServiceRepo: FcmServiceIRepo) {}

  public async execute(
    topic: string,
    title: string,
    body: string,
    icon: string,
  ): Promise<void> {
    await this.fcmServiceRepo.sendTopicNotification(topic, title, body, icon);
  }
}
