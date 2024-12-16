import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEntity } from './infra/data/entities/config.entity';
import { IConfigRepo } from './core/repositories/config.irepo';
import { ConfigRepo } from './infra/data/repositories/config.repo';
import { ConfigDatasource } from './infra/data/config.datasource';
import { GetConfigUsecase } from './core/usecase';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntity])],
  controllers: [],
  providers: [
    {
      provide: IConfigRepo,
      useClass: ConfigRepo,
    },
    ConfigDatasource,
    GetConfigUsecase,
  ],
  exports: [GetConfigUsecase],
})
export class BankConfigModule {}
