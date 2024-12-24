import { Injectable } from '@nestjs/common';
import { DebtModel, DebtModelParams } from '../models/debt.model';
import { IDebtRepo } from '../repositories/debt.irepo';
import { GetBankAccountUsecase } from 'src/modules/bank_account/core/usecases';
import { Status } from '../enum/status';

@Injectable()
export class CreateDebtUsecase {
  constructor(
    private readonly iDebtRepo: IDebtRepo,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
  ) {}
  public async execute(
    reminderUserId: string,
    params: DebtModelParams,
  ): Promise<DebtModel | undefined> {
    type CreateDebtParams = Pick<
      DebtModelParams,
      'reminderId' | 'debtorId' | 'amount' | 'status' | 'message'
    >;

    const bankAccountUser = await this.getBankAccountUsecase.execute(
      'user_id',
      reminderUserId,
    );
    if (!bankAccountUser) throw new Error('ReminderNotFoundError');

    const debtor = await this.getBankAccountUsecase.execute(
      'id',
      params['debtorId'],
    );
    if (!debtor) {
      throw new Error('DebtorNotFoundError');
    }

    if (bankAccountUser.id === debtor.id) {
      throw new Error('CannotCreateDebtForSelfError');
    }

    params['status'] = Status.Indebted;
    params['reminderId'] = bankAccountUser.id;

    const newDebt = new DebtModel(params as CreateDebtParams);
    await this.iDebtRepo.create(newDebt);
    return newDebt;
  }
}
