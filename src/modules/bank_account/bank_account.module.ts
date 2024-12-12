import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IBankAccountRepo } from './core/repositories/bank_account.irepo';
import { BankAccountRepo } from './infra/data/repositories/bank_account.repo';
import { BankAccountDatasource } from './infra/data/bank_account.datasource';
import {
  ChangeBalanceUsecase,
  CreateBankAccountUsecase,
  GetBankAccountUsecase,
} from './core/usecases';
import { BankAccountEntity } from './infra/data/entities/bank_account.entity';
import { BankModule } from '../bank/bank.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BankAccountEntity]),
    forwardRef(() => BankModule),
  ],
  controllers: [],
  providers: [
    {
      provide: IBankAccountRepo,
      useClass: BankAccountRepo,
    },
    BankAccountDatasource,
    CreateBankAccountUsecase,
    GetBankAccountUsecase,
    ChangeBalanceUsecase,
  ],
  exports: [GetBankAccountUsecase],
})
export class BankAccountModule {}
