import { Injectable } from '@nestjs/common';
import { ITransactionRepo } from '../repositories/transaction.irepo';
import {
  TransactionModel,
  TransactionModelParams,
} from '../models/transaction.model';
import { TransactionStatus } from '../enums/transaction_status';

@Injectable()
export class CreateTransactionUsecase {
  constructor(private readonly transactionRepo: ITransactionRepo) {}

  public async execute(
    params: TransactionModelParams,
  ): Promise<TransactionModel> {
    type CreateTransactionParams = Pick<
      TransactionModelParams,
      | 'remitterId'
      | 'beneficiaryId'
      | 'beneficiaryBankId'
      | 'amount'
      | 'message'
      | 'type'
      | 'status'
      | 'transactionFee'
      | 'remitterPaidFee'
    >;

    params['status'] = TransactionStatus.CREATED;

    const transaction = new TransactionModel(params as CreateTransactionParams);

    await this.transactionRepo.create(transaction);
    return transaction;
  }
}
