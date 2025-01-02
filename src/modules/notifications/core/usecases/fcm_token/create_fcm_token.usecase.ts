import { Injectable } from '@nestjs/common';
import { FcmTokenIRepo } from '../../repositories/fcm_token.irepo';
import {
  FcmTokenModel,
  FcmTokenModelParams,
} from '../../models/fcm_token.model';

@Injectable()
export class CreateFcmTokenUsecase {
  constructor(private readonly fcmTokenRepo: FcmTokenIRepo) {}

  public async execute(params: FcmTokenModelParams): Promise<FcmTokenModel> {
    type createFcmToken = Pick<FcmTokenModelParams, 'token' | 'userId'>;

    const newFcmToken = new FcmTokenModel(params as createFcmToken);

    await this.fcmTokenRepo.create(newFcmToken);

    return newFcmToken;
  }
}
