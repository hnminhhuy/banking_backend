import { Injectable } from '@nestjs/common';
import { TransactionStatus } from '../enums/transaction_status';
import { UpdateTransactionUsecase } from './update_transaction.usecase';

@Injectable()
export class HandleTransactionFailureUsecase {
  constructor(
    private readonly updateTransactionStatusUsecase: UpdateTransactionUsecase,
  ) {}

  async execute(transactionId: string, error: Error): Promise<void> {
    await this.updateTransactionStatusUsecase.execute(
      transactionId,
      TransactionStatus.FAILED,
    );
    console.error(`Transaction ${transactionId} failed: ${error.message}`);
  }
}
