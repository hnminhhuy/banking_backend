import { Injectable } from '@nestjs/common';
import { IConfigRepo } from '../repositories/config.irepo';
import { ConfigModel } from '../models/config.model';

@Injectable()
export class GetConfigUsecase {
  constructor(private readonly configRepo: IConfigRepo) {}

  public async execute(key: string): Promise<ConfigModel> {
    return this.configRepo.get(key);
  }
}
