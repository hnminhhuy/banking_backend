import { Injectable } from '@nestjs/common';
import { IBankAccountRepo } from '../repositories/bank_account.irepo';
import { BankAccountModel } from '../models/bank_account.model';
import { BankAccountUserModel } from '../models/bank_account_user.model';

@Injectable()
export class GetBankAccountWithUserUsecase {
  constructor(private readonly bankAccountRepo: IBankAccountRepo) {}

  public async execute(id: string): Promise<BankAccountUserModel | undefined> {
    const result = await this.bankAccountRepo.getBankAccountWithUser(id);
    return result;
  }
}
