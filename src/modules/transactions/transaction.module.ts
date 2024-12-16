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
  UpdateTransactionUsecase,
} from './core/usecases';
import { TransactionController } from './app/controller/transaction.controller';
import { AppModule } from '../../app/app.module';
import { BankAccountModule } from '../bank_account/bank_account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    forwardRef(() => AppModule),
    forwardRef(() => BankAccountModule),
  ],
  controllers: [TransactionController],
  providers: [
    {
      provide: ITransactionRepo,
      useClass: TransactionRepo,
    },
    TransactionDatasource,
    CreateTransactionUsecase,
    GetTransactionUsecase,
    ListTransactionUsecase,
    UpdateTransactionUsecase,
    UpdateTransactionUsecase,
  ],
})
export class TransactionModule {}
