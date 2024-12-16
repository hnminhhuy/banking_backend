import { Inject, Injectable } from '@nestjs/common';
import { IBankAccountRepo } from '../repositories/bank_account.irepo';
import {
  BankAccountModel,
  BankAccountParams,
} from '../models/bank_account.model';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { GetBankAccountUsecase } from './get_bank_account.usecase';
import { GetMaxBankAccountUsecase } from './get_max_bank_account.usecase';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class CreateBankAccountUsecase {
  constructor(
    private readonly bankAccountRepo: IBankAccountRepo,
    private readonly getBankUsecase: GetBankUsecase,
    private readonly getMaxBankAccountUsecase: GetMaxBankAccountUsecase,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  public async execute(params: BankAccountParams): Promise<BankAccountModel> {
    const bank = await this.getBankUsecase.execute('code', 'NHB');
    type CreateBankAccountParams = Pick<
      BankAccountParams,
      'bankId' | 'userId' | 'balance' | 'id'
    >;

    params['bankId'] = bank.id;
    params['id'] = await this.generateBankAccount();

    const newBankAccount = new BankAccountModel(
      params as CreateBankAccountParams,
    );
    await this.bankAccountRepo.create(newBankAccount);
    return newBankAccount;
  }

  private async generateBankAccount(length: number = 8): Promise<string> {
    const cacheMaxBankAccount = await this.cacheManager.get('maxBankAccount');

    let maxBankAccount: number;
    if (cacheMaxBankAccount) {
      maxBankAccount = parseInt(cacheMaxBankAccount as string, 10);
    } else {
      const maxId = await this.getMaxBankAccountUsecase.execute();
      if (maxId !== null) {
        maxBankAccount = maxId;
      } else {
        maxBankAccount = parseInt(
          this.configService.get('constant.bankAccountStart'),
          10,
        );
      }

      await this.cacheManager.set('maxBankAccount', maxBankAccount.toString());
    }

    const accountNumber = (maxBankAccount + 1).toString().padStart(length, '0');

    return accountNumber;
  }
}
