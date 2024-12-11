import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh_token.entity';
import { Repository } from 'typeorm';
import { RefreshTokenModel } from '../../core/models/refresh_token.model';

@Injectable()
export class RefreshTokenDatasource {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refTokenRepository: Repository<RefreshTokenEntity>,
  ) {}
  public async create(refreshToken: RefreshTokenModel): Promise<void> {
    const newRefreshToken = this.refTokenRepository.create(refreshToken);
    await this.refTokenRepository.insert(newRefreshToken);
  }
  public async get(
    userIdOrBankId: string,
  ): Promise<RefreshTokenModel | undefined> {
    const entity = await this.refTokenRepository.findOne({
      where: [{ userId: userIdOrBankId }, { bankId: userIdOrBankId }],
    });
    return new RefreshTokenModel(entity);
  }
  public async deleteById(id: string): Promise<boolean> {
    const entity = await this.refTokenRepository.findOne({
      where: [{ id: id }],
    });
    if (!entity) return false;
    return (await this.refTokenRepository.delete(entity)).affected > 0;
  }
}
