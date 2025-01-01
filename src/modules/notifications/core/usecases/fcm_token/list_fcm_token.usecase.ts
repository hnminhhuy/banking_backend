import { Injectable } from '@nestjs/common';
import { FcmTokenIRepo } from '../../repositories/fcm_token.irepo';
import { FcmTokenModel } from '../../models/fcm_token.model';

@Injectable()
export class ListFcmTokenUsecase {
  constructor(private readonly fcmTokenRepo: FcmTokenIRepo) {}

  public async execute(userId: string): Promise<FcmTokenModel[]> {
    return await this.fcmTokenRepo.findAllByUserId(userId);
  }
}
