import { Injectable } from '@nestjs/common';
import { IBankAccountRepo } from '../../repositories/bank_account.irepo';
import { BankModel } from '../../../../bank/core/models/bank.model';

@Injectable()
export class GetExternalBankAccountInfoUsecase {
  constructor(private readonly bankAccountRepo: IBankAccountRepo) {}

  async execute(externalBank: BankModel, id: string): Promise<any> {
    return await this.bankAccountRepo.get(externalBank, id);
  }
}
