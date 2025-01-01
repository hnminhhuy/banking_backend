import { BankModel } from '../../../bank/core/models/bank.model';
import { TransactionModelParams } from '../../../transactions/core/models/transaction.model';

export abstract class ITransactionRepo {
  abstract createTransaction(
    externalBank: BankModel,
    params: TransactionModelParams,
  ): Promise<Record<string, any>>;
}
