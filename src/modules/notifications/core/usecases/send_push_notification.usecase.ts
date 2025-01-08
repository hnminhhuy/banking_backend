import { Injectable } from '@nestjs/common';
import { CreateNotificationUsecase } from './notification/create_notification.usecase';
import { ListFcmTokenUsecase } from './fcm_token/list_fcm_token.usecase';
import { SendNotificationToMultipleTokensUsecase } from './fcm_service/send_notification_to_multiple_tokens.usecase';
import { NotificationType } from '../enums/notification_type';
import { NotificationIcon } from '../enums/notification_icon';
import { NotificationBodyHandlerUsecase } from './notification_body_handler.usecase';
import { TransactionGateway } from 'src/modules/transactions/infra/transaction_websocket';

@Injectable()
export class SendPushNotificationUseCase {
  constructor(
    private readonly createNotificationUsecase: CreateNotificationUsecase,
    private readonly listFcmTokenUsecase: ListFcmTokenUsecase,
    private readonly sendNotificationToMultipleTokensUsecase: SendNotificationToMultipleTokensUsecase,
    private readonly notificationBodyHandlerUsecase: NotificationBodyHandlerUsecase,
    private readonly transactionGateway: TransactionGateway,
  ) {}

  public async execute(
    userId: string,
    type: NotificationType,
    debtId: string | undefined,
    transactionId: string | undefined,
  ) {
    this.transactionGateway.sendMessageToUser(userId, {
      value: 'reload transaction',
    });
    const body = await this.notificationBodyHandlerUsecase.execute(
      type,
      userId,
      transactionId,
      debtId,
    );

    const notification = await this.createNotificationUsecase.execute({
      userId,
      body,
      type,
    });

    const fcmTokens = await this.listFcmTokenUsecase.execute(userId);

    try {
      return await this.sendNotificationToMultipleTokensUsecase.execute(
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
