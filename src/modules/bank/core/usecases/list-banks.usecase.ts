import { Injectable } from '@nestjs/common';
import { IBankRepo } from '../repositories/bank.irepo';
import { Page, PageParams, SortParams } from '../../../../common/models';
import { BANK_SORT_KEY } from '../enums/bank_sort_key';
import { BankModel } from '../models/bank.model';

@Injectable()
export class ListBanksUsecase {
  constructor(private readonly bankRepo: IBankRepo) {}

  public async execute(
    pageParams: PageParams,
    sortParams: SortParams<BANK_SORT_KEY>,
    relations: string[] | undefined = undefined,
  ): Promise<Page<BankModel>> {
    return await this.bankRepo.list(pageParams, sortParams, relations);
  }
}
