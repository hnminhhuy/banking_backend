import { Injectable } from '@nestjs/common';
import { FcmTokenIRepo } from '../../repositories/fcm_token.irepo';

@Injectable()
export class DeleteFcmTokenUsecase {
  constructor(private readonly fcmTokenRepo: FcmTokenIRepo) {}

  public async execute(userId: string, token: string): Promise<void> {
    await this.fcmTokenRepo.deleteByToken(userId, token);
  }
}
