import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FcmService } from './infra/services/fcm.service';
import { FcmController } from './app/controller/fcm.controller';

@Module({
  imports: [],
  controllers: [FcmController],
  providers: [FcmService],
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
