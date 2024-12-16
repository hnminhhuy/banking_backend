import { Injectable } from '@nestjs/common';
import { ITransactionRepo } from '../../../core/repositories/transaction.irepo';
import { TransactionDatasource } from '../transaction.datasource';
import { PageParams, SortParams, Page } from '../../../../../common/models';
import { TransactionSort } from '../../../core/enums/transaction_sort';
import { TransactionStatus } from '../../../core/enums/transaction_status';
import { TransactionType } from '../../../core/enums/transaction_type';
import {
  TransactionModel,
  TransactionModelParams,
} from '../../../core/models/transaction.model';

@Injectable()
export class TransactionRepo implements ITransactionRepo {
  constructor(private readonly transactionDatasource: TransactionDatasource) {}

  public async create(transacion: TransactionModel): Promise<void> {
    await this.transactionDatasource.create(transacion);
  }

  public async get(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<TransactionModel | undefined> {
    return await this.transactionDatasource.get(key, value, relations);
  }

  public async list(
    pageParams: PageParams,
    sortParams: SortParams<TransactionSort> | undefined,
    type: TransactionType | undefined,
    status: TransactionStatus | undefined,
    relations: string[] | undefined,
  ): Promise<Page<TransactionModel>> {
    return await this.transactionDatasource.list(
      pageParams,
      sortParams,
      type,
      status,
      relations,
    );
  }

  public async update(
    id: string,
    updatedFields: Partial<TransactionModelParams>,
  ): Promise<boolean> {
    return await this.transactionDatasource.update(id, updatedFields);
  }
}
