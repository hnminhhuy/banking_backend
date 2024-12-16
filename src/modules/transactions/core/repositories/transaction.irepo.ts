import { Page, PageParams, SortParams } from '../../../../common/models';
import { TransactionSort } from '../enums/transaction_sort';
import { TransactionStatus } from '../enums/transaction_status';
import { TransactionType } from '../enums/transaction_type';
import {
  TransactionModel,
  TransactionModelParams,
} from '../models/transaction.model';

export abstract class ITransactionRepo {
  public abstract create(transacion: TransactionModel): Promise<void>;

  public abstract get(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<TransactionModel | undefined>;

  public abstract list(
    pageParams: PageParams,
    sortParams: SortParams<TransactionSort> | undefined,
    type: TransactionType | undefined,
    status: TransactionStatus | undefined,
    relations: string[] | undefined,
  ): Promise<Page<TransactionModel>>;

  public abstract update(
    id: string,
    updatedFields: Partial<TransactionModelParams>,
  ): Promise<boolean>;
}
