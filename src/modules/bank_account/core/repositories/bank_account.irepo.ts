import { Page, PageParams, SortParams } from '../../../../common/models';
import { BankAccountSort } from '../enums/bank_account_sort';
import { BankAccountModel } from '../models/bank_account.model';
import { BankAccountUserModel } from '../models/bank_account_user.model';

export abstract class IBankAccountRepo {
  public abstract create(bankAccount: BankAccountModel): Promise<void>;

  public abstract get(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  );

  public abstract getBankAccountWithUser(
    id: string,
  ): Promise<BankAccountUserModel | undefined>;

  public abstract changeBalance(
    bankAccount: BankAccountModel,
    balance: number,
  ): Promise<boolean>;

  public abstract list(
    pageParams: PageParams,
    sortParams: SortParams<BankAccountSort> | undefined,
    relations: string[] | undefined,
  ): Promise<Page<BankAccountModel>>;

  public abstract getMaxBankAccountId(): Promise<number | null>;
}
