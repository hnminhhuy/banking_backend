import { Injectable } from '@nestjs/common';
import { IBankAccountRepo } from '../../../core/repositories/bank_account.irepo';
import { BankAccountDatasource } from '../bank_account.datasource';
import { BankAccountModel } from '../../../core/models/bank_account.model';

@Injectable()
export class BankAccountRepo implements IBankAccountRepo {
  constructor(private readonly bankAccountDatasource: BankAccountDatasource) {}

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
}
