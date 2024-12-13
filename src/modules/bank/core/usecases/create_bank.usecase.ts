import { Injectable } from '@nestjs/common';
import { IBankRepo } from '../repositories/bank.irepo';
import { BankModel, BankModelParams } from '../models/bank.model';

@Injectable()
export class CreateBankUsecase {
  constructor(private readonly bankRepo: IBankRepo) {}

  public async execute(params: BankModelParams): Promise<BankModel> {
    type CreateBankParams = Pick<
      BankModelParams,
      'code' | 'name' | 'shortName' | 'publicKey' | 'logoUrl'
    >;

    const newBank = new BankModel(params as CreateBankParams);

    await this.bankRepo.create(newBank);

    return newBank;
  }
}
