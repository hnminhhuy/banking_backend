import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FcmService } from './infra/services/fcm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmTokenEntity } from './infra/data/entities/fcm_token.entity';
import { FcmTokenIRepo } from './core/repositories/fcm_token.irepo';
import { FcmTokenRepo } from './infra/data/repositories/fcm_token.repo';
import { FcmTokenDatasource } from './infra/data/fcm_token.datasource';
import { NotificationEntity } from './infra/data/entities/notification.entity';
import { NotificationIRepo } from './core/repositories/notification.irepo';
import { NotificationRepo } from './infra/data/repositories/notification.repo';
import { NotificationDatasource } from './infra/data/notification.datasource';
import { SendTopicNotification } from './core/usecases/fcm_service/send_topic_notification';
import { SendNotificationToMultipleTokensUsecase } from './core/usecases/fcm_service/send_notification_to_multiple_tokens.usecase';
import { SendNotificationUsecase } from './core/usecases/fcm_service/send_notification.usecase';
import { FcmServiceIRepo } from './core/repositories/fcm_service.irepo';
import { FcmServiceRepo } from './infra/data/repositories/fcm_service.repo';
import { CreateFcmTokenUsecase } from './core/usecases/fcm_token/create_fcm_token.usecase';
import { DeleteFcmTokenUsecase } from './core/usecases/fcm_token/delete_fcm_token.usecase';
import { ListFcmTokenUsecase } from './core/usecases/fcm_token/list_fcm_token.usecase';
import { CreateNotificationUsecase } from './core/usecases/notification/create_notification.usecase';
import { ListNotificationUsecase } from './core/usecases/notification/list_notification.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([FcmTokenEntity, NotificationEntity])],
  controllers: [],
  providers: [
    FcmService,
    {
      provide: FcmTokenIRepo,
      useClass: FcmTokenRepo,
    },
    {
      provide: NotificationIRepo,
      useClass: NotificationRepo,
    },
    {
      provide: FcmServiceIRepo,
      useClass: FcmServiceRepo,
    },
    NotificationDatasource,
    FcmTokenDatasource,
    SendTopicNotification,
    SendNotificationToMultipleTokensUsecase,
    SendNotificationUsecase,
    CreateFcmTokenUsecase,
    DeleteFcmTokenUsecase,
    ListFcmTokenUsecase,
    CreateNotificationUsecase,
    ListNotificationUsecase,
  ],
})
export class NotificationModule {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
}
