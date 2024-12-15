import { Injectable } from '@nestjs/common';
import { ConfigModel } from 'src/modules/config/core/models/config.model';
import { IConfigRepo } from 'src/modules/config/core/repositories/config.irepo';
import { ConfigDatasource } from '../config.datasource';

@Injectable()
export class ConfigRepo implements IConfigRepo {
  constructor(private readonly configDatasource: ConfigDatasource) {}

  public get(key: string): Promise<ConfigModel> {
    return this.configDatasource.get(key);
  }
}
