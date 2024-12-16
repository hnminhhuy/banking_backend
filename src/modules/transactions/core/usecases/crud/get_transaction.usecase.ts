import { Injectable } from '@nestjs/common';
import { ITransactionRepo } from '../../repositories/transaction.irepo';
import { TransactionModel } from '../../models/transaction.model';

@Injectable()
export class GetTransactionUsecase {
  constructor(private readonly transactionRepo: ITransactionRepo) {}

  public async execute(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<TransactionModel | undefined> {
    return await this.transactionRepo.get(key, value, relations);
  }
}
