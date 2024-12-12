import { Injectable } from '@nestjs/common';
import { IBankAccountRepo } from '../repositories/bank_account.irepo';
import { BankAccountModel } from '../models/bank_account.model';

@Injectable()
export class GetBankAccountUsecase {
  constructor(private readonly bankAccountRepo: IBankAccountRepo) {}

  public async execute(
    key: string,
    value: unknown,
    relations: string[] | undefined = undefined,
  ): Promise<BankAccountModel | undefined> {
    return this.bankAccountRepo.get(key, value, relations);
  }
}
