import { Injectable } from '@nestjs/common';
import { ConfigDatasource } from '../config.datasource';
import { IConfigRepo } from 'src/modules/bank_config/core/repositories/config.irepo';
import { ConfigModel } from 'src/modules/bank_config/core/models/config.model';

@Injectable()
export class ConfigRepo implements IConfigRepo {
  constructor(private readonly configDatasource: ConfigDatasource) {}

  public get(key: string): Promise<ConfigModel> {
    return this.configDatasource.get(key);
  }
}
