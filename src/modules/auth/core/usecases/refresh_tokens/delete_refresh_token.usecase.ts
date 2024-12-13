import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepo } from '../../repositories/refresh_token.irepo';

@Injectable()
export class DeleteRefreshTokenUsecase {
  constructor(private readonly refTokenRepo: IRefreshTokenRepo) {}
  public async deleteById(id: string): Promise<boolean> {
    return await this.refTokenRepo.deleteById(id);
  }
}
