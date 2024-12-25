import { Injectable } from '@nestjs/common';
import { DebtModel, DebtModelParams } from '../models/debt.model';
import { IDebtRepo } from '../repositories/debt.irepo';
import { GetBankAccountUsecase } from 'src/modules/bank_account/core/usecases';
import { DebtStatus } from '../enum/debt_status';
import { GetDebtUsecase } from './get_debt.usecase';

@Injectable()
export class CancelDebtUsecase {
  constructor(
    private readonly iDebtRepo: IDebtRepo,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getDebtUsecase: GetDebtUsecase,
  ) {}
  public async execute(userId: string, debtId: string): Promise<boolean> {
    // Check if user has a bank account
    const bankAccountUser = await this.getBankAccountUsecase.execute(
      'user_id',
      userId,
    );
    if (!bankAccountUser) {
      throw new Error('AccountNotFoundError');
    }

    // Check if debt exists
    const debt = await this.getDebtUsecase.execute('id', debtId);
    if (!debt) {
      throw new Error('DebtNotFoundError');
    }

    // Check ownership of the debt
    if (debt.reminderId !== bankAccountUser.id) {
      throw new Error('DebtNotBelongToUserError');
    }

    // Check if debt is already canceled
    if (debt.status === DebtStatus.Canceled) {
      throw new Error('DebtAlreadyCanceledError');
    }

    // Check if debt is cancellable
    if (debt.status !== DebtStatus.Indebted) {
      throw new Error('DebtCannotBeCancelledError');
    }

    // Cancel the debt
    const result = await this.iDebtRepo.cancelDebt(debtId);
    if (!result) {
      throw new Error('DebtCancelFailedError');
    }

    return result;
  }
}
