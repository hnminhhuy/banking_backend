import { Injectable } from '@nestjs/common';
import { IBankAccountRepo } from '../../core/repositories/bank_account.irepo';
import { BankAccountService } from '../services/bank_account.service';
import { BankModel } from '../../../bank/core/models/bank.model';

@Injectable()
export class BankAccountRepo implements IBankAccountRepo {
  constructor(private readonly bankAccountService: BankAccountService) {}
  async get(externalBank: BankModel, id: string): Promise<any> {
    return await this.bankAccountService.getUser(externalBank, id);
  }
}
