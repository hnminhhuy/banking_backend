import { Injectable } from '@nestjs/common';
import { ITransactionRepo } from '../repositories/transaction.irepo';
import { TransactionModel } from '../models/transaction.model';
import { TransactionStatus } from '../enums/transaction_status';

@Injectable()
export class UpdateTransactionsUsecase {
  constructor(private readonly transactionRepo: ITransactionRepo) {}

  public async execute(
    transactions: TransactionModel[],
    status: TransactionStatus,
  ): Promise<void> {
    const ids = transactions.map((transaction) => transaction.id);
    await this.transactionRepo.updateMany(ids, status, new Date());
  }
}
