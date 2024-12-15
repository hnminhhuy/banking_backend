import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepo } from '../../../core/repositories/refresh_token.irepo';
import { RefreshTokenDatasource } from '../refresh_token.datasource';
import { RefreshTokenModel } from '../../../core/models/refresh_token.model';

@Injectable()
export class RefreshTokenRepo implements IRefreshTokenRepo {
  constructor(private readonly refTokenDatasource: RefreshTokenDatasource) {}
  public async create(refreshToken: RefreshTokenModel): Promise<void> {
    await this.refTokenDatasource.create(refreshToken);
  }
  public async get(
    key: string,
    value: unknown,
  ): Promise<RefreshTokenModel | undefined> {
    return await this.refTokenDatasource.get(key, value);
  }
  public async deleteById(id: string): Promise<boolean> {
    return await this.refTokenDatasource.deleteById(id);
  }
}
