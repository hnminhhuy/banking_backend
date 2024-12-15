import { Injectable } from '@nestjs/common';
import { IBankRepo } from '../repositories/bank.irepo';
import { BankModel } from '../models/bank.model';

@Injectable()
export class GetBankUsecase {
  constructor(private readonly bankRepo: IBankRepo) {}

  public async execute(
    key: string,
    value: unknown,
    relations: string[] | undefined = undefined,
  ): Promise<BankModel | undefined> {
    return await this.bankRepo.get(key, value, relations);
  }
}
