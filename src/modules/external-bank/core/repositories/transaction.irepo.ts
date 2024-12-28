import { TransactionModelParams } from '../../../transactions/core/models/transaction.model';

export abstract class ITransactionRepo {
  abstract createTransaction(
    params: TransactionModelParams,
  ): Promise<Record<string, any>>;
}
