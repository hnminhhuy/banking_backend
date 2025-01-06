import { Injectable } from '@nestjs/common';
import { ITransactionRepo } from '../../../core/repositories/transaction.irepo';
import { TransactionDatasource } from '../transaction.datasource';
import {
  PageParams,
  SortParams,
  Page,
  DateFilter,
} from '../../../../../common/models';
import { TransactionSort } from '../../../core/enums/transaction_sort';
import { TransactionStatus } from '../../../core/enums/transaction_status';
import { TransactionType } from '../../../core/enums/transaction_type';
import { TransactionModel } from '../../../core/models/transaction.model';
import { BankModel } from '../../../../bank/core/models/bank.model';
import { TransactionCustomerChartMode } from '../../../core/enums/transaction_customer_chart_mode';

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
    sortParams: SortParams<TransactionSort>,
    dateFilterParams: DateFilter | undefined,
    remitterId: string | undefined,
    beneficiaryId: string | undefined,
    bankId: string | undefined,
    statuses: TransactionStatus[] | undefined,
    type: TransactionType | undefined,
    relations: string[] | undefined = undefined,
  ): Promise<Page<TransactionModel>> {
    return await this.transactionDatasource.list(
      pageParams,
      sortParams,
      dateFilterParams,
      remitterId,
      beneficiaryId,
      bankId,
      statuses,
      type,
      relations,
    );
  }

  public async update(
    id: string,
    status: TransactionStatus | undefined,
  ): Promise<boolean> {
    return await this.transactionDatasource.update(id, status);
  }

  public async updateMany(
    ids: string[],
    status: TransactionStatus | undefined,
    completedAt: Date,
  ): Promise<void> {
    return await this.transactionDatasource.updateMany(
      ids,
      status,
      completedAt,
    );
  }

  public async statistic(
    defaultBank: BankModel,
    externalBank: BankModel,
  ): Promise<any> {
    return await this.transactionDatasource.statistic(
      defaultBank,
      externalBank,
    );
  }

  public async getDashboardInfo(
    bankAccountId: string,
    mode: TransactionCustomerChartMode,
  ): Promise<Record<string, any>> {
    return await this.transactionDatasource.getDashboardInfo(
      bankAccountId,
      mode,
    );
  }
}
