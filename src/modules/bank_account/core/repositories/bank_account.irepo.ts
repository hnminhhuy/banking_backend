import { Page, PageParams, SortParams } from '../../../../common/models';
import { BANK_ACCOUNT_SORT_KEY } from '../enums/bank_account_sort_key';
import { BankAccountModel } from '../models/bank_account.model';

export abstract class IBankAccountRepo {
  public abstract create(bankAccount: BankAccountModel): Promise<void>;

  public abstract get(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  );

  public abstract changeBalance(
    bankAccount: BankAccountModel,
    balance: number,
  ): Promise<boolean>;

  public abstract list(
    pageParams: PageParams,
    sortParams: SortParams<BANK_ACCOUNT_SORT_KEY> | undefined,
    relations: string[] | undefined,
  ): Promise<Page<BankAccountModel>>;
}
