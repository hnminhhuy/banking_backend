import { Injectable } from '@nestjs/common';
import { IBankAccountRepo } from '../repositories/bank_account.irepo';

@Injectable()
export class GetMaxBankAccountUsecase {
  constructor(private readonly bankAccountRepo: IBankAccountRepo) {}

  public async execute(): Promise<number | null> {
    return await this.bankAccountRepo.getMaxBankAccountId();
  }
}
