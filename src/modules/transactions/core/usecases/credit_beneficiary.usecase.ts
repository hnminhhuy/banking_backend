import { Injectable } from '@nestjs/common';
import { UpdateTransactionUsecase } from './update_transaction.usecase';
import { ChangeBalanceUsecase } from '../../../bank_account/core/usecases';
import { TransactionStatus } from '../enums/transaction_status';

@Injectable()
export class CreditBeneficiaryUsecase {
  constructor(
    private readonly changeBalanceUsecase: ChangeBalanceUsecase,
    private readonly updateTransactionStatusUsecase: UpdateTransactionUsecase,
  ) {}

  async execute(
    transactionId: string,
    beneficiaryId: string,
    amount: number,
  ): Promise<void> {
    try {
      await this.changeBalanceUsecase.execute(beneficiaryId, amount);
      await this.updateTransactionStatusUsecase.execute(
        transactionId,
        TransactionStatus.SUCCESS,
      );
    } catch (error) {
      await this.changeBalanceUsecase.execute(beneficiaryId, -amount);
      throw new Error(`Failed to credit beneficiary: ${error.message}`);
    }
  }
}
