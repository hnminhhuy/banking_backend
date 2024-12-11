import { Injectable } from '@nestjs/common';
import { IBankRepo } from '../../../core/repositories/bank.irepo';
import { BankDatasource } from '../bank.datasource';
import { BankModel } from '../../../core/models/bank.model';

@Injectable()
export class BankRepo implements IBankRepo {
  constructor(private readonly bankDatasource: BankDatasource) {}

  public async create(bank: BankModel): Promise<void> {
    await this.bankDatasource.create(bank);
  }

  public async get(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<BankModel | undefined> {
    return await this.bankDatasource.get(key, value, relations);
  }
}
