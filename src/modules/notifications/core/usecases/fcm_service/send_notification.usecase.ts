import { Injectable } from '@nestjs/common';
import { FcmServiceIRepo } from '../../repositories/fcm_service.irepo';

@Injectable()
export class SendNotificationUsecase {
  constructor(private readonly FcmServiceRepo: FcmServiceIRepo) {}

  public async execute(
    token: string,
    title: string,
    body: string,
    icon: string,
  ): Promise<void> {
    await this.FcmServiceRepo.sendNotification(token, title, body, icon);
  }
}
