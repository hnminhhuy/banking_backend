import { Injectable } from '@nestjs/common';
import { TransactionModelParams } from '../../../../transactions/core/models/transaction.model';
import { ITransactionRepo } from '../../repositories/transaction.irepo';

@Injectable()
export class CreateAnotherBankTransactionUsecase {
  constructor(private readonly transactionRepo: ITransactionRepo) {}

  async execute(params: TransactionModelParams): Promise<Record<string, any>> {
    return await this.transactionRepo.createTransaction(params);
  }
}
