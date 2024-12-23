import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './infra/data/entities/transaction.entity';
import { ITransactionRepo } from './core/repositories/transaction.irepo';
import { TransactionRepo } from './infra/data/repositories/transaction.repo';
import { TransactionDatasource } from './infra/data/transaction.datasource';
import {
  CreateTransactionUsecase,
  GetTransactionUsecase,
  ListTransactionUsecase,
} from './core/usecases';
import { TransactionController as TransactionControllerByCustomer } from './app/controller/customer/transaction.controller';
import { AppModule } from '../../app/app.module';
import { BankAccountModule } from '../bank_account/bank_account.module';
import { BullModule } from '@nestjs/bullmq';
import { UpdateTransactionUsecase } from './core/usecases/update_transaction.usecase';
import { TransactionConsumer } from './app/consumer/transaction.consumer';
import { UserModule } from '../user/user.module';
import { BankConfigModule } from '../bank_config/bank_config.module';
import { OtpModule } from '../otp/otp.module';
import { TransactionController as TransactionControllerByEmployee } from './app/controller/employee/transaction.controller';
import { AnotherBankModule } from '../another-bank/another_bank.module';
import { BankModule } from '../bank/bank.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    BullModule.registerQueue({
      name: 'transaction-queue',
    }),
    forwardRef(() => AppModule),
    forwardRef(() => BankAccountModule),
    forwardRef(() => UserModule),
    forwardRef(() => BankConfigModule),
    forwardRef(() => OtpModule),
    forwardRef(() => AnotherBankModule),
    forwardRef(() => BankModule),
  ],
  controllers: [
    TransactionControllerByCustomer,
    TransactionControllerByEmployee,
  ],
  providers: [
    TransactionConsumer,
    {
      provide: ITransactionRepo,
      useClass: TransactionRepo,
    },
    TransactionDatasource,
    CreateTransactionUsecase,
    GetTransactionUsecase,
    UpdateTransactionUsecase,
    ListTransactionUsecase,
  ],
  exports: [
    CreateTransactionUsecase,
    GetTransactionUsecase,
    UpdateTransactionUsecase,
  ],
})
export class TransactionModule {}
