import { Injectable } from '@nestjs/common';
import { CreateNotificationUsecase } from './notification/create_notification.usecase';
import { ListFcmTokenUsecase } from './fcm_token/list_fcm_token.usecase';
import { SendNotificationToMultipleTokensUsecase } from './fcm_service/send_notification_to_multiple_tokens.usecase';
import { NotificationType } from '../enums/notification_type';

@Injectable()
export class SendPushNotificationUseCase {
  constructor(
    private readonly createNotificationUsecase: CreateNotificationUsecase,
    private readonly listFcmTokenUsecase: ListFcmTokenUsecase,
    private readonly sendNotificationToMultipleTokensUsecase: SendNotificationToMultipleTokensUsecase,
  ) {}

  public async execute(
    userId: string,
    type: NotificationType,
    message: string,
  ) {}
}
