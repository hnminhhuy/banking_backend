import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IBankAccountRepo } from '../repositories/bank_account.irepo';
import { UserModel } from '../../../user/core/models/user.model';
import { GetBankAccountUsecase } from './get_bank_account.usecase';

@Injectable()
export class ChangeBalanceUsecase {
  constructor(
    private readonly bankAccountRepo: IBankAccountRepo,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
  ) {}

  public async execute(customer: UserModel, amount: number): Promise<boolean> {
    const bankAccount = await this.getBankAccountUsecase.execute(
      'user_id',
      customer.id,
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
