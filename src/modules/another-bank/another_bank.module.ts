import { forwardRef, Module } from '@nestjs/common';
import { AnotherBankService } from './infra/services/another_bank.service';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { BankAccountService } from './infra/services/bank_account.service';
import { IBankAccountRepo } from './core/repositories/bank_account.irepo';
import { BankAccountRepo } from './infra/repositories/bank_account.repo';
import { GetAnotherBankAccountInfoUsecase } from './core/usecases/bank_account/get_another_bank_user.usecase';
import { BankAccountController } from './app/controllers/bank_account.controller';
import { BankAccountModule } from '../bank_account/bank_account.module';
import { TransactionController } from './app/controllers/transaction.controller';
import { TransactionModule } from '../transactions/transaction.module';
import { BullModule } from '@nestjs/bullmq';
import { TransactionService } from './infra/services/transaction.service';
import { BankModule } from '../bank/bank.module';
import { CreateAnotherBankTransactionUsecase } from './core/usecases/transactions/create_another_bank_transaction.usecase';
import { ITransactionRepo } from './core/repositories/transaction.irepo';
import { TransactionRepo } from './infra/repositories/transaction.repo';

@Module({
  imports: [
    CacheModule.register(),
    HttpModule,
    BullModule.registerQueue({
      name: 'transaction-interbank-queue',
    }),
    forwardRef(() => BankAccountModule),
    forwardRef(() => BankModule),
    forwardRef(() => TransactionModule),
  ],
  controllers: [BankAccountController, TransactionController],
  providers: [
    {
      provide: IBankAccountRepo,
      useClass: BankAccountRepo,
    },
    {
      provide: ITransactionRepo,
      useClass: TransactionRepo,
    },
    AnotherBankService,
    BankAccountService,
    TransactionService,
    GetAnotherBankAccountInfoUsecase,
    CreateAnotherBankTransactionUsecase,
  ],
  exports: [GetAnotherBankAccountInfoUsecase],
})
export class AnotherBankModule {}
