import { Injectable } from '@nestjs/common';
import { TransactionModelParams } from '../../../../transactions/core/models/transaction.model';
import { ITransactionRepo } from '../../repositories/transaction.irepo';
import { BankModel } from '../../../../bank/core/models/bank.model';

@Injectable()
export class CreateExternalBankTransactionUsecase {
  constructor(private readonly transactionRepo: ITransactionRepo) {}

  async execute(
    externalBank: BankModel,
    params: TransactionModelParams,
  ): Promise<Record<string, any>> {
    return await this.transactionRepo.createTransaction(externalBank, params);
  }
}
