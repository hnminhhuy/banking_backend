import { Injectable } from '@nestjs/common';
import { ListTransactionUsecase } from '../../../transactions/core/usecases';
import { PageParams, SortParams } from '../../../../common/models';
import { TransactionSort } from '../../../transactions/core/enums/transaction_sort';
import { TransactionCategory } from '../../../transactions/core/enums/transaction_category';
import { TransactionType } from '../../../transactions/core/enums/transaction_type';
import { calBalanceChange } from '../../../transactions/core/helpers/calculate_amount';
import { GetBankAccountUsecase } from '../../../bank_account/core/usecases';
import { GetCustomerDashboardCountUsecase } from '../../../debt/core/usecases/get_customer_dashboard_count.usecase';

@Injectable()
export class GetCustomerDashBoardInfoUsecase {
  constructor(
    private readonly listTransactionUsecase: ListTransactionUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getCustomerDashboardCountUsecase: GetCustomerDashboardCountUsecase,
  ) {}

  async execute(userId: string) {
    const bankAccount = await this.getBankAccountUsecase.execute(
      'userId',
      userId,
    );

    const recentTransactions = await this.getTransactions(bankAccount.id);
    const debtCount = await this.getCustomerDashboardCountUsecase.execute(
      bankAccount.id,
    );

    return { recentTransactions, debtCount };
  }

  private async getTransactions(bankAccountId: string) {
    const pageParams = new PageParams(1, 10, true, false);
    const sortParams: SortParams<TransactionSort> = new SortParams(
      TransactionSort.CREATED_AT,
      'DESC',
    );
    const transactions = await this.listTransactionUsecase.execute(
      pageParams,
      sortParams,
      undefined,
      bankAccountId,
      bankAccountId,
      undefined,
      undefined,
      undefined,
      ['beneficiaryBank', 'remitterBank'],
    );

    const data = transactions.data.map((transaction) => {
      const isRemitter = transaction.remitterId === bankAccountId;

      let transactionCategory = isRemitter
        ? TransactionCategory.OUTCOMING
        : TransactionCategory.INCOMING;

      if (transaction.type === TransactionType.DEBT) {
        transactionCategory = TransactionCategory.DEBT;
      }

      const transactionAmount = calBalanceChange(transaction, bankAccountId);

      return {
        id: transaction.id,
        date: transaction.updatedAt,
        status: transaction.status,
        category: transactionCategory,
        amount: transactionAmount,
        message: transaction.message,
        relatedUser: {
          name: isRemitter
            ? transaction.beneficiaryName
            : transaction.remitterName,
          bankAccountId: isRemitter
            ? transaction.beneficiaryId
            : transaction.remitterId,
          bankName: isRemitter
            ? transaction.beneficiaryBank.name
            : transaction.remitterBank.name,
        },
      };
    });

    return data;
  }
}
