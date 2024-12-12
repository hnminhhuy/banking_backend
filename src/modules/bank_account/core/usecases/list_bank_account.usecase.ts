import { Injectable } from '@nestjs/common';
import { Page, PageParams, SortParams } from '../../../../common/models';
import { IBankAccountRepo } from '../repositories/bank_account.irepo';
import { BANK_ACCOUNT_SORT_KEY } from '../enums/bank_account_sort_key';
import { BankAccountModel } from '../models/bank_account.model';

@Injectable()
export class ListBankAccountsUsecase {
  constructor(private readonly bankAccountRepo: IBankAccountRepo) {}

  public async execute(
    pageParams: PageParams,
    sortParams: SortParams<BANK_ACCOUNT_SORT_KEY>,
    relations: string[] | undefined = undefined,
  ): Promise<Page<BankAccountModel>> {
    return await this.bankAccountRepo.list(pageParams, sortParams, relations);
  }
}
