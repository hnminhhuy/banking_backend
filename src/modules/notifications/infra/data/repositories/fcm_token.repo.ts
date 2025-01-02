import { Injectable } from '@nestjs/common';
import { FcmTokenIRepo } from '../../../core/repositories/fcm_token.irepo';
import { FcmTokenDatasource } from '../fcm_token.datasource';
import { FcmTokenModel } from '../../../core/models/fcm_token.model';

@Injectable()
export class FcmTokenRepo implements FcmTokenIRepo {
  constructor(private readonly fcmTokenDatasource: FcmTokenDatasource) {}

  async create(params: FcmTokenModel) {
    return this.fcmTokenDatasource.create(params);
  }

  async deleteByToken(userId: string, token: string) {
    return this.fcmTokenDatasource.deleteByToken(userId, token);
  }

  async findAllByUserId(userId: string) {
    return this.fcmTokenDatasource.findAllByUserId(userId);
  }
}
