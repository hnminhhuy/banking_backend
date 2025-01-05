import { Injectable } from '@nestjs/common';
import { ITransactionRepo } from '../repositories/transaction.irepo';
import { TransactionCustomerChartMode } from '../enums/transaction_customer_chart_mode';

@Injectable()
export class GetCustomerDashboardTransactionUsecase {
  constructor(private readonly transactionRepo: ITransactionRepo) {}

  public async execute(
    bankAccountId: string,
    mode: TransactionCustomerChartMode,
  ) {
    return await this.transactionRepo.getDashboardInfo(bankAccountId, mode);
  }
}
