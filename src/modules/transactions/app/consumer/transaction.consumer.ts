import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ChangeBalanceUsecase } from '../../../bank_account/core/usecases';
import { TransactionStatus } from '../../core/enums/transaction_status';
import { UpdateTransactionStatusUsecase } from '../../core/usecases/update_transaction_status.usecase';
import { Transactional } from 'typeorm-transactional';

@Processor('transaction-queue', { concurrency: 1 })
export class TransactionConsumer extends WorkerHost {
  constructor(
    private readonly changeBalanceUsecase: ChangeBalanceUsecase,
    private readonly updateStatusUsecase: UpdateTransactionStatusUsecase,
  ) {
    super();
  }

  @Transactional()
  async process(job: Job): Promise<void> {
    const {
      id,
      remitterId,
      beneficiaryId,
      amount,
      transactionFee,
      remitterPaidFee,
    } = job.data.transaction;

    const remitterAmount = remitterPaidFee ? amount + transactionFee : amount;
    const beneficiaryAmount = remitterPaidFee
      ? amount
      : amount + transactionFee;

    try {
      await this.changeBalanceUsecase.execute(
        String(remitterId),
        -remitterAmount,
      );

      try {
        await this.changeBalanceUsecase.execute(
          String(beneficiaryId),
          beneficiaryAmount,
        );

        await this.updateStatusUsecase.execute(id, TransactionStatus.SUCCESS);
      } catch (beneficiaryError) {
        await this.changeBalanceUsecase.execute(
          String(remitterId),
          remitterAmount,
        );
        await this.updateStatusUsecase.execute(id, TransactionStatus.FAILED);

        console.error(
          `Failed to credit beneficiary: ${beneficiaryError.message}`,
        );
      }
    } catch (remitterError) {
      await this.updateStatusUsecase.execute(id, TransactionStatus.FAILED);
      console.error(`Failed to debit remitter: ${remitterError.message}`);
    }
  }
}
