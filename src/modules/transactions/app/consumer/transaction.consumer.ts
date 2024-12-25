import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ChangeBalanceUsecase } from '../../../bank_account/core/usecases';
import { TransactionStatus } from '../../core/enums/transaction_status';
import { UpdateTransactionUsecase } from '../../core/usecases/update_transaction.usecase';
import { Transactional } from 'typeorm-transactional';
import { CreateAnotherBankTransactionUsecase } from '../../../another-bank/core/usecases/transactions/create_another_bank_transaction.usecase';
import { BankCode } from '../../../bank/core/enums/bank_code';
import { BadRequestException } from '@nestjs/common';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { UpdateDebtUsecase } from '../../../debt/core/usecases/update_debt.usecase';
import { TransactionType } from '../../core/enums/transaction_type';
import { DebtStatus } from '../../../debt/core/enum/debt_status';

@Processor('transaction-queue', { concurrency: 1 })
export class TransactionConsumer extends WorkerHost {
  constructor(
    private readonly changeBalanceUsecase: ChangeBalanceUsecase,
    private readonly updateTransactionStatusUsecase: UpdateTransactionUsecase,
    private readonly createAnotherBankTransactionUsecase: CreateAnotherBankTransactionUsecase,
    private readonly bankCode: BankCode,
    private readonly getBankUsecase: GetBankUsecase,
    private readonly updateDebtUsecase: UpdateDebtUsecase,
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

    try {
      await this.debitRemitter(remitterId, remitterAmount);

      if (remitterBankId === beneficiaryBankId) {
        await this.creditBeneficiary(id, beneficiaryId, beneficiaryAmount);
      } else {
        await this.processInterBankTransaction(transaction);
      }

      if (type === TransactionType.DEBT) {
        await this.updateDebtUsecase.execute(debtId, DebtStatus.Settled);
      }
    } catch (error) {
      await this.debitRemitter(remitterId, -remitterAmount);

      await this.handleTransactionFailure(id, error);
    }
  }

  private async debitRemitter(
    remitterId: string,
    amount: number,
  ): Promise<void> {
    await this.changeBalanceUsecase.execute(String(remitterId), -amount);
  }

  private async creditBeneficiary(
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
      // Rollback remitter balance on failure
      await this.changeBalanceUsecase.execute(beneficiaryId, -amount);

      throw new Error(`Failed to credit beneficiary: ${error.message}`);
    }
  }

  private async processInterBankTransaction(transaction: any): Promise<void> {
    const { id, beneficiaryBankId } = transaction;

    const anotherBank = await this.getBankUsecase.execute(
      'id',
      beneficiaryBankId,
    );
    if (!anotherBank) {
      throw new BadRequestException(
        `Bank with ID ${beneficiaryBankId} not found`,
      );
    }

    if (anotherBank.code === this.bankCode.ANOTHER_BANK) {
      try {
        const res =
          await this.createAnotherBankTransactionUsecase.execute(transaction);
        if (res.data) {
          await this.updateTransactionStatusUsecase.execute(
            id,
            TransactionStatus.SUCCESS,
          );
        } else {
          throw new Error('Failed to complete interbank transaction');
        }
      } catch (error) {
        throw new Error(`Interbank transaction failed: ${error.message}`);
      }
    } else {
      throw new BadRequestException('Invalid beneficiary bank ID');
    }
  }

  private async handleTransactionFailure(
    transactionId: string,
    error: Error,
  ): Promise<void> {
    await this.updateTransactionStatusUsecase.execute(
      transactionId,
      TransactionStatus.FAILED,
    );
    console.error(`Transaction ${transactionId} failed: ${error.message}`);
  }
}
