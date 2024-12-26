import { BadRequestException, Injectable } from '@nestjs/common';
import { GetBankAccountUsecase } from '../../../bank_account/core/usecases';
import { GetConfigUsecase } from '../../../bank_config/core/usecase';
import { CreateTransactionUsecase } from './create_transaction.usecase';
import { DebtModel } from '../../../debt/core/models/debt.model';
import { ConfigKey } from '../../../bank_config/core/enum/config_key';
import { BankAccountModel } from '../../../bank_account/core/models/bank_account.model';
import {
  TransactionModel,
  TransactionModelParams,
} from '../models/transaction.model';
import { TransactionType } from '../enums/transaction_type';
import { CreateOtpUsecase } from '../../../otp/core/usecases';
import { OtpType } from '../../../otp/core/enums/otpType.enum';

@Injectable()
export class CreateDebtTransactionUsecase {
  constructor(
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getConfigUsecase: GetConfigUsecase,
    private readonly createTransactionUsecase: CreateTransactionUsecase,
    private readonly createOtpUsecase: CreateOtpUsecase,
  ) {}

  async execute(
    debt: DebtModel,
    debtorAccount: BankAccountModel,
  ): Promise<TransactionModel> {
    const fee = (
      await this.getConfigUsecase.execute(ConfigKey.INTERNAL_TRANSACTION_FEE)
    ).getValue();

    if (debtorAccount.balance + fee < debt.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const reminderAccount = await this.getBankAccountUsecase.execute(
      'id',
      debt.reminderId,
      ['user'],
    );

    const params: TransactionModelParams = {
      amount: debt.amount,
      remitterId: debt.debtorId,
      type: TransactionType.DEBT,
      transactionFee: fee,
      beneficiaryId: debt.reminderId,
      beneficiaryBankId: reminderAccount.bankId,
      remitterPaidFee: true,
      message: debt.message,
      beneficiaryName: reminderAccount.user?.fullName,
      remitterBankId: debtorAccount.bankId,
      remitterName: debtorAccount.user.fullName,
      debtId: debt.id,
    };

    const transaction = await this.createTransactionUsecase.execute(params);

    await this.createOtpUsecase.execute(
      OtpType.TRANSACTION,
      debtorAccount.user.id,
      {
        transactionId: transaction.id,
      },
    );

    return transaction;
  }
}
