import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankEntity } from './infra/data/entities/bank.entity';
import { IBankRepo } from './core/repositories/bank.irepo';
import { BankRepo } from './infra/data/repositories/bank.repo';
import { BankDatasource } from './infra/data/bank.datasource';
import {
  CreateBankUsecase,
  GetBankUsecase,
  ListBanksUsecase,
} from './core/usecases';
import { BankController } from './app/controller/customer/bank.controller';
import { BankCode } from './core/enums/bank_code';

@Module({
  imports: [TypeOrmModule.forFeature([BankEntity])],
  controllers: [BankController],
  providers: [
    BankCode,
    {
      provide: IBankRepo,
      useClass: BankRepo,
    },
    BankDatasource,
    CreateBankUsecase,
    GetBankUsecase,
    ListBanksUsecase,
  ],
  exports: [GetBankUsecase, BankCode],
})
export class BankModule {}
