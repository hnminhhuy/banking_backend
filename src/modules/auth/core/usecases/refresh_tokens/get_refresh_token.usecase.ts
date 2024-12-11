import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepo } from '../../repositories/refresh_token.irepo';
import { RefreshTokenModel } from '../../models/refresh_token.model';

@Injectable()
export class GetRefreshTokenUsecase {
  constructor(private readonly refTokenRepo: IRefreshTokenRepo) {}
  public async execute(
    userIdOrBankId: string,
  ): Promise<RefreshTokenModel | undefined> {
    return await this.refTokenRepo.get(userIdOrBankId);
  }
}
