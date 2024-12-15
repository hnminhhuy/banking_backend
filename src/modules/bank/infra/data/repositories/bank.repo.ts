import { Injectable } from '@nestjs/common';
import { IBankRepo } from '../../../core/repositories/bank.irepo';
import { BankDatasource } from '../bank.datasource';
import { BankModel } from '../../../core/models/bank.model';
import { Page, PageParams, SortParams } from '../../../../../common/models';
import { BankSort } from '../../../core/enums/bank_sort';

@Injectable()
export class BankRepo implements IBankRepo {
  constructor(private readonly bankDatasource: BankDatasource) {}

  public async list(
    pageParams: PageParams,
    sortParams: SortParams<BankSort> | undefined,
    relations: string[] | undefined,
  ): Promise<Page<BankModel>> {
    return await this.bankDatasource.list(pageParams, sortParams, relations);
  }

  public async create(bank: BankModel): Promise<void> {
    await this.bankDatasource.create(bank);
  }

  public async get(
    key: string,
    value: unknown,
    relations: string[] | undefined = undefined,
  ): Promise<BankModel | undefined> {
    return await this.bankDatasource.get(key, value, relations);
  }
}
