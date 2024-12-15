import { Injectable } from '@nestjs/common';
import { IBankAccountRepo } from '../repositories/bank_account.irepo';
import {
  BankAccountModel,
  BankAccountParams,
} from '../models/bank_account.model';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { GetBankAccountUsecase } from './get_bank_account.usecase';

@Injectable()
export class CreateBankAccountUsecase {
  constructor(
    private readonly bankAccountRepo: IBankAccountRepo,
    private readonly getBankUsecase: GetBankUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
  ) {}

  public async execute(params: BankAccountParams): Promise<BankAccountModel> {
    const bank = await this.getBankUsecase.execute('code', 'NHB');
    type CreateBankAccountParams = Pick<
      BankAccountParams,
      'bankId' | 'userId' | 'balance' | 'id'
    >;

    params['bankId'] = bank.id;
    params['balance'] = 0;
    params['id'] = await this.generateBankAccount();

    const newBankAccount = new BankAccountModel(
      params as CreateBankAccountParams,
    );
    await this.bankAccountRepo.create(newBankAccount);
    return newBankAccount;
  }
  private async generateBankAccount(length: number = 8): Promise<string> {
    let accountNumber = '';

    accountNumber += Math.floor(Math.random() * 9) + 1;

    for (let i = 1; i < length; i++) {
      accountNumber += Math.floor(Math.random() * 10);
    }

    const exists = await this.getBankAccountUsecase.execute(
      'id',
      accountNumber,
    );

    if (!exists) {
      return accountNumber;
    }

    return this.generateBankAccount(length);
  }
}
