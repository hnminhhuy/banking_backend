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
    NotificationDatasource,
    FcmTokenDatasource,
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
