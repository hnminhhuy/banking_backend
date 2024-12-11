import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankEntity } from './infra/data/entities/bank.entity';
import { IBankRepo } from './core/repositories/bank.irepo';
import { BankRepo } from './infra/data/repositories/bank.repo';
import { BankDatasource } from './infra/data/bank.datasource';
import { CreateBankUsecase } from './core/usecases/create_bank.usecase';
import { GetBankUsecase } from './core/usecases/get_bank.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([BankEntity])],
  controllers: [],
  providers: [
    {
      provide: IBankRepo,
      useClass: BankRepo,
    },
    BankDatasource,
    CreateBankUsecase,
    GetBankUsecase,
  ],
})
export class BankModule {}
