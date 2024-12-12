import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankEntity } from './infra/data/entities/bank.entity';
import { IBankRepo } from './core/repositories/bank.irepo';
import { BankRepo } from './infra/data/repositories/bank.repo';
import { BankDatasource } from './infra/data/bank.datasource';
import { CreateBankUsecase, GetBankUsecase } from './core/usecases';
import { ListBanksUsecase } from './core/usecases/list-banks.usecase';
import { BankController } from './app/controller/customer/bank.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BankEntity])],
  controllers: [BankController],
  providers: [
    {
      provide: IBankRepo,
      useClass: BankRepo,
    },
    BankDatasource,
    CreateBankUsecase,
    GetBankUsecase,
    ListBanksUsecase,
  ],
  exports: [GetBankUsecase],
})
export class BankModule {}
