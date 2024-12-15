import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigEntity } from './entities/config.entity';
import { Repository } from 'typeorm';
import { ConfigModel } from '../../core/models/config.model';

@Injectable()
export class ConfigDatasource {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepository: Repository<ConfigEntity>,
  ) {}

  public async get(key: string): Promise<ConfigModel | undefined> {
    const entity = await this.configRepository.findOne({
      where: { key: key },
    });

    return entity ? new ConfigModel(entity) : undefined;
  }
}
