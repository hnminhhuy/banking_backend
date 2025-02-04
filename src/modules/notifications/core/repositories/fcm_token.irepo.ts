import { FcmTokenModel, FcmTokenModelParams } from '../models/fcm_token.model';

export abstract class FcmTokenIRepo {
  abstract create(params: FcmTokenModel): Promise<void>;
  abstract deleteByToken(userId: string, token: string): Promise<void>;
  abstract findAllByUserId(userId: string): Promise<FcmTokenModel[]>;
}
