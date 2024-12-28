import { Injectable } from '@nestjs/common';
import { IBankAccountRepo } from '../../core/repositories/bank_account.irepo';
import { BankAccountService } from '../services/bank_account.service';

@Injectable()
export class BankAccountRepo implements IBankAccountRepo {
  constructor(private readonly bankAccountService: BankAccountService) {}
  async get(id: string): Promise<any> {
    return await this.bankAccountService.getUser(id);
  }
}
