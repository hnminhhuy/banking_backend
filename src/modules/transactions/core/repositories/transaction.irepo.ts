import {
  DateFilter,
  Page,
  PageParams,
  SortParams,
} from '../../../../common/models';
import { BankModel } from '../../../bank/core/models/bank.model';
import { TransactionCustomerChartMode } from '../enums/transaction_customer_chart_mode';
import { TransactionSort } from '../enums/transaction_sort';
import { TransactionStatus } from '../enums/transaction_status';
import { TransactionType } from '../enums/transaction_type';
import { TransactionModel } from '../models/transaction.model';

export abstract class ITransactionRepo {
  public abstract create(transacion: TransactionModel): Promise<void>;

  public abstract get(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<TransactionModel | undefined>;

  public abstract list(
    pageParams: PageParams,
    sortParams: SortParams<TransactionSort>,
    dateFilterParams: DateFilter | undefined,
    remitterId: string | undefined,
    beneficiaryId: string | undefined,
    bankId: string | undefined,
    statuses: TransactionStatus[] | undefined,
    type: TransactionType | undefined,
    relations: string[] | undefined,
  ): Promise<Page<TransactionModel>>;

  public abstract update(
    id: string,
    status: TransactionStatus | undefined,
  ): Promise<boolean>;

  public abstract updateMany(
    ids: string[],
    status: TransactionStatus | undefined,
    completedAt: Date,
  ): Promise<void>;

  public abstract statistic(
    defaultBank: BankModel,
    externalBank: BankModel,
  ): Promise<any>;

  public abstract getDashboardInfo(
    bankAccountId: string,
    mode: TransactionCustomerChartMode,
  ): Promise<Record<string, any>>;
}
