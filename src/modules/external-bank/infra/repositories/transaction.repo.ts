import { Injectable } from '@nestjs/common';
import { ITransactionRepo } from '../../core/repositories/transaction.irepo';
import { TransactionService } from '../services/transaction.service';
import { TransactionModelParams } from '../../../transactions/core/models/transaction.model';

@Injectable()
export class TransactionRepo implements ITransactionRepo {
  constructor(private readonly transactionService: TransactionService) {}

  async createTransaction(
    params: TransactionModelParams,
  ): Promise<Record<string, any>> {
    return await this.transactionService.createTransaction(params);
  }
}
