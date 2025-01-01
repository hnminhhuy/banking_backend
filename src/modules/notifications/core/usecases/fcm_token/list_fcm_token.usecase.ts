import { Injectable } from '@nestjs/common';
import { FcmTokenIRepo } from '../../repositories/fcm_token.irepo';
import { FcmTokenModel } from '../../models/fcm_token.model';
import { UserModel } from '../../../../user/core/models/user.model';

@Injectable()
export class ListFcmTokenUsecase {
  constructor(private readonly fcmTokenRepo: FcmTokenIRepo) {}

  public async execute(user: UserModel): Promise<FcmTokenModel[]> {
    return await this.fcmTokenRepo.findAllByUserId(user.id);
  }
}
