import { Injectable } from '@nestjs/common';
import { FcmServiceIRepo } from '../../repositories/fcm_service.irepo';

@Injectable()
export class SendNotificationToMultipleTokensUsecase {
  constructor(private readonly fcmServiceRepo: FcmServiceIRepo) {}

  public async execute(
    tokens: string[],
    title: string,
    body: string,
    icon: string,
  ): Promise<void> {
    await this.fcmServiceRepo.sendNotificationToMultipleTokens(
      tokens,
      title,
      body,
      icon,
    );
  }
}
