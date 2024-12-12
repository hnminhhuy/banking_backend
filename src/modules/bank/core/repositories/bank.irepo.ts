import { Page, PageParams, SortParams } from '../../../../common/models';
import { BANK_SORT_KEY } from '../enums/bank_sort_key';
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
    sortParams: SortParams<BANK_SORT_KEY> | undefined,
    relations: string[] | undefined,
  ): Promise<Page<BankModel>>;
}
