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
import { TransactionController } from './app/controller/transaction.controller';
import { AppModule } from '../../app/app.module';
import { BankAccountModule } from '../bank_account/bank_account.module';
import { BullModule } from '@nestjs/bullmq';
import { UpdateTransactionStatusUsecase } from './core/usecases/update_transaction_status.usecase';
import { TransactionConsumer } from './app/consumer/transaction.consumer';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    BullModule.registerQueue({
      name: 'transaction-queue',
    }),
    forwardRef(() => AppModule),
    forwardRef(() => BankAccountModule),
    forwardRef(() => UserModule),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionConsumer,
    {
      provide: ITransactionRepo,
      useClass: TransactionRepo,
    },
    TransactionDatasource,
    CreateTransactionUsecase,
    GetTransactionUsecase,
    UpdateTransactionStatusUsecase,
    ListTransactionUsecase,
  ],
})
export class TransactionModule {}
