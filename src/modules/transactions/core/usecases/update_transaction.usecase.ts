import { Injectable } from '@nestjs/common';
import { ITransactionRepo } from '../repositories/transaction.irepo';
import { TransactionStatus } from '../enums/transaction_status';

@Injectable()
export class UpdateTransactionUsecase {
  constructor(private readonly transactionRepo: ITransactionRepo) {}

  public async execute(
    id: string,
    status: TransactionStatus | undefined,
  ): Promise<boolean> {
    return await this.transactionRepo.update(id, status);
  }
}
