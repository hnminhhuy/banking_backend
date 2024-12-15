import { Page, PageParams, SortParams } from '../../../../common/models';
import { BankSort } from '../enums/bank_sort';
import { BankModel } from '../models/bank.model';

export abstract class IBankRepo {
  public abstract create(bank: BankModel): Promise<void>;
  public abstract get(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<BankModel | undefined>;
  public abstract list(
    pageParams: PageParams,
    sortParams: SortParams<BankSort> | undefined,
    relations: string[] | undefined,
  ): Promise<Page<BankModel>>;
}
