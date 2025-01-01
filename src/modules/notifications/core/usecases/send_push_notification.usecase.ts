import { Injectable } from '@nestjs/common';
import { CreateNotificationUsecase } from './notification/create_notification.usecase';
import { ListFcmTokenUsecase } from './fcm_token/list_fcm_token.usecase';
import { SendNotificationToMultipleTokensUsecase } from './fcm_service/send_notification_to_multiple_tokens.usecase';
import { NotificationType } from '../enums/notification_type';
import { NotificationIcon } from '../enums/notification_icon';

@Injectable()
export class SendPushNotificationUseCase {
  constructor(
    private readonly createNotificationUsecase: CreateNotificationUsecase,
    private readonly listFcmTokenUsecase: ListFcmTokenUsecase,
    private readonly sendNotificationToMultipleTokensUsecase: SendNotificationToMultipleTokensUsecase,
  ) {}

  public async execute(userId: string, type: NotificationType, body: string) {
    const notification = await this.createNotificationUsecase.execute({
      userId,
      body,
      type,
    });

    const fcmTokens = await this.listFcmTokenUsecase.execute(userId);

    try {
      await this.sendNotificationToMultipleTokensUsecase.execute(
        fcmTokens.map((fcmToken) => fcmToken.token),
        notification.title,
        notification.body,
        NotificationIcon.BELL,
      );
    } catch (error) {
      console.error(error.message);
    }
  }
}
