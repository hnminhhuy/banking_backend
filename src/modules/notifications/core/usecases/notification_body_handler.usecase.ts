import { Injectable } from '@nestjs/common';
import { GetDebtUsecase } from '../../../debt/core/usecases';
import { GetTransactionUsecase } from '../../../transactions/core/usecases';
import { NotificationType } from '../enums/notification_type';
import { throwError } from '../../../../common/helpers/throw_error';
import { GetUserUsecase } from '../../../user/core/usecases';
import { calBalanceChange } from '../../../transactions/core/helpers/calculate_amount';

@Injectable()
export class NotificationBodyHandlerUsecase {
  constructor(
    private readonly getUserUsecase: GetUserUsecase,
    private readonly getDebtUsecase: GetDebtUsecase,
    private readonly getTransactionUsecase: GetTransactionUsecase,
  ) {}

  public async execute(
    type: NotificationType,
    userId: string,
    transactionId: string | undefined,
    debtId: string | undefined,
  ) {
    if (!transactionId && !debtId) {
      throwError('Transaction ID or Debt ID is required');
    }
    let message = '';

    switch (type) {
      case NotificationType.TRANSACTION_SUCCESS: {
        const transaction = await this.getTransactionUsecase.execute(
          'id',
          transactionId,
          undefined,
        );
        if (!transaction) {
          throwError('Transaction is required');
        }

        message = `Transaction of ${transaction.amount} to ${
          transaction.beneficiaryName
        } was successful!`;
        return message;
      }
      case NotificationType.TRANSACTION_FAILED: {
        const transactionFailed = await this.getTransactionUsecase.execute(
          'id',
          transactionId,
          undefined,
        );
        if (!transactionFailed) {
          throwError('Transaction is required');
        }

        message = `Transaction of ${transactionFailed.amount} to ${
          transactionFailed.beneficiaryName
        } failed!`;
        return message;
      }
      case NotificationType.DEBT_CREATED_FOR_YOU: {
        const debt = await this.getDebtUsecase.execute('id', debtId, undefined);
        if (!debt) {
          throwError('Debt is required');
        }

        message = `You have a debt of ${debt.amount} from ${
          debt.debtorFullName
        }`;
        return message;
      }
      case NotificationType.DEBT_PAID: {
        const debtPaid = await this.getDebtUsecase.execute('id', debtId, [
          'debtorFullName',
        ]);
        if (!debtPaid) {
          throwError('Debt is required');
        }

        message = `You have  been paid a debt of ${debtPaid.amount} from ${
          debtPaid.debtorFullName
        }`;
        return message;
      }
      case NotificationType.BALANCE_UPDATE: {
        const transaction = await this.getTransactionUsecase.execute(
          'id',
          transactionId,
          undefined,
        );
        const user = await this.getUserUsecase.execute('id', userId, [
          'bankAccount',
        ]);
        if (!transaction) {
          throwError('Transaction is required');
        }

        let amount = calBalanceChange(transaction, user.id);

        if (user.id === transaction.remitterId) {
          message = `Your account has been changed with -${amount} to ${transaction.beneficiaryName}. Now your balance is ${user.bankAccount.balance}`;
          return message;
        }

        amount = calBalanceChange(transaction, user.id);
        if (user.id === transaction.beneficiaryId) {
          message = `Your account has been changed with +${amount} from ${transaction.remitterName}. Now your balance is ${user.bankAccount.balance}`;
          return message;
        }
      }
      default:
        throwError('Invalid notification type');
    }
  }
}
