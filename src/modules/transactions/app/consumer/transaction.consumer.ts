import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ChangeBalanceUsecase } from '../../../bank_account/core/usecases';
import { Transactional } from 'typeorm-transactional';
import { UpdateDebtUsecase } from '../../../debt/core/usecases/update_debt.usecase';
import { TransactionType } from '../../core/enums/transaction_type';
import { DebtStatus } from '../../../debt/core/enum/debt_status';
import {
  CreditBeneficiaryUsecase,
  HandleTransactionFailureUsecase,
  ProcessInterBankTransactionUsecase,
} from '../../core/usecases';

@Processor('transaction-queue', { concurrency: 1 })
export class TransactionConsumer extends WorkerHost {
  constructor(
    private readonly changeBalanceUsecase: ChangeBalanceUsecase,
    private readonly updateDebtUsecase: UpdateDebtUsecase,
    private readonly creditBeneficiaryUsecase: CreditBeneficiaryUsecase,
    private readonly processInterBankTransactionUsecase: ProcessInterBankTransactionUsecase,
    private readonly handleTransactionFailureUsecase: HandleTransactionFailureUsecase,
  ) {
    super();
  }

  @Transactional()
  async process(job: Job): Promise<void> {
    const transaction = job.data.transaction;
    const {
      id,
      remitterId,
      beneficiaryId,
      remitterBankId,
      beneficiaryBankId,
      amount,
      transactionFee,
      type,
      debtId,
      remitterPaidFee,
    } = transaction;

    const remitterAmount = remitterPaidFee ? amount + transactionFee : amount;
    const beneficiaryAmount = remitterPaidFee
      ? amount
      : amount - transactionFee;

    await this.changeBalanceUsecase.execute(remitterId, -remitterAmount);

    if (remitterBankId === beneficiaryBankId) {
      await this.creditBeneficiaryUsecase.execute(
        id,
        beneficiaryId,
        beneficiaryAmount,
      );
    } else {
      await this.processInterBankTransactionUsecase.execute(transaction);
    }

    if (type === TransactionType.DEBT) {
      await this.updateDebtUsecase.execute(debtId, DebtStatus.Settled);
    }
  }
}
