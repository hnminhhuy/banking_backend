import { Injectable } from '@nestjs/common';
import { FcmServiceIRepo } from '../../../core/repositories/fcm_service.irepo';
import { FcmService } from '../../services/fcm.service';

@Injectable()
export class FcmServiceRepo implements FcmServiceIRepo {
  constructor(private readonly fcmService: FcmService) {}
  async sendNotification(
    token: string,
    title: string,
    body: string,
    icon: string,
  ): Promise<void> {
    await this.fcmService.sendNotification(token, title, body, icon);
  }
  async sendNotificationToMultipleTokens(
    tokens: string[],
    title: string,
    body: string,
    icon: string,
  ): Promise<void> {
    await this.fcmService.sendNotificationToMultipleTokens(
      tokens,
      title,
      body,
      icon,
    );
  }
  async sendTopicNotification(
    topic: string,
    title: string,
    body: string,
    icon: string,
  ): Promise<void> {
    await this.fcmService.sendTopicNotification(topic, title, body, icon);
  }
}
