import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IBankAccountRepo } from '../repositories/bank_account.irepo';
import { GetBankAccountUsecase } from './get_bank_account.usecase';

@Injectable()
export class ChangeBalanceUsecase {
  constructor(
    private readonly bankAccountRepo: IBankAccountRepo,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
  ) {}

  public async execute(id: string, amount: number): Promise<boolean> {
    const bankAccount = await this.getBankAccountUsecase.execute(
      'id',
      id,
      undefined,
    );
    if (!bankAccount) {
      throw new NotFoundException('Account not found');
    }

    if (amount < 0 && bankAccount.balance < Math.abs(amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    const balance = bankAccount.balance + amount;

    return await this.bankAccountRepo.changeBalance(bankAccount, balance);
  }
}
