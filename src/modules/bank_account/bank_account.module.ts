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
import {
  BankAccountControllerByCustomer,
  BankAccountControllerByEmployee,
} from './app/controller';
import { ListBankAccountsUsecase } from './core/usecases/list_bank_account.usecase';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BankAccountEntity]),
    forwardRef(() => BankModule),
    forwardRef(() => UserModule),
  ],
  controllers: [
    BankAccountControllerByCustomer,
    BankAccountControllerByEmployee,
  ],
  providers: [
    {
      provide: IBankAccountRepo,
      useClass: BankAccountRepo,
    },
    BankAccountDatasource,
    CreateBankAccountUsecase,
    GetBankAccountUsecase,
    ChangeBalanceUsecase,
    ListBankAccountsUsecase,
  ],
  exports: [GetBankAccountUsecase, CreateBankAccountUsecase],
})
export class BankAccountModule {}