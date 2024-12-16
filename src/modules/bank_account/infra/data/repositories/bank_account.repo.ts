import { Injectable } from '@nestjs/common';
import { IBankAccountRepo } from '../../../core/repositories/bank_account.irepo';
import { BankAccountDatasource } from '../bank_account.datasource';
import { BankAccountModel } from '../../../core/models/bank_account.model';
import { PageParams, SortParams, Page } from '../../../../../common/models';
import { BankAccountSort } from '../../../core/enums/bank_account_sort';

@Injectable()
export class BankAccountRepo implements IBankAccountRepo {
  constructor(private readonly bankAccountDatasource: BankAccountDatasource) {}

  public async list(
    pageParams: PageParams,
    sortParams: SortParams<BankAccountSort> | undefined,
    relations: string[] | undefined,
  ): Promise<Page<BankAccountModel>> {
    return await this.bankAccountDatasource.list(
      pageParams,
      sortParams,
      relations,
    );
  }

  public async create(bankAccount: BankAccountModel): Promise<void> {
    await this.bankAccountDatasource.create(bankAccount);
  }

  public async get(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ) {
    return await this.bankAccountDatasource.get(key, value, relations);
  }

  public async changeBalance(
    bankAccount: BankAccountModel,
    balance: number,
  ): Promise<boolean> {
    return await this.bankAccountDatasource.changeBalance(bankAccount, balance);
  }

  public async getMaxBankAccountId(): Promise<number | null> {
    return await this.bankAccountDatasource.getMaxBankAccountId();
  }
}
