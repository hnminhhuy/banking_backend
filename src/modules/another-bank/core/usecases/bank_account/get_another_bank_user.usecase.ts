import { Injectable } from '@nestjs/common';
import { IBankAccountRepo } from '../../repositories/bank_account.irepo';

@Injectable()
export class GetAnotherBankAccountInfoUsecase {
  constructor(private readonly bankAccountRepo: IBankAccountRepo) {}

  async execute(id: string): Promise<any> {
    return await this.bankAccountRepo.get(id);
  }
}
