import { Injectable } from '@nestjs/common';
import { GetDebtUsecase } from '../../../debt/core/usecases';
import { GetTransactionUsecase } from '../../../transactions/core/usecases';
import { NotificationType } from '../enums/notification_type';
import { throwError } from '../../../../common/helpers/throw_error';
import { GetUserUsecase } from '../../../user/core/usecases';
import { calBalanceChange } from '../../../transactions/core/helpers/calculate_amount';
import { GetDebtWithUserUsecase } from '../../../debt/core/usecases/get_debt_with_user.usecase';

@Injectable()
export class NotificationBodyHandlerUsecase {
  constructor(
    private readonly getUserUsecase: GetUserUsecase,
    private readonly getDebtWithUserUsecase: GetDebtWithUserUsecase,
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

        message = `Giao dịch ${transaction.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} đến ${
          transaction.beneficiaryName
        } đã thành công!`;
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

        message = `Giao dịch ${transactionFailed.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} đến ${
          transactionFailed.beneficiaryName
        } đã thất bại!`;
        return message;
      }
      case NotificationType.DEBT_CREATED_FOR_YOU: {
        const debt = await this.getDebtWithUserUsecase.execute(debtId);

        if (!debt) {
          throwError('Debt is required');
        }

        message = `Bạn có một khoản nợ ${debt.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} từ ${debt.reminderFullName}`;
        return message;
      }
      case NotificationType.DEBT_PAID: {
        const debtPaid = await this.getDebtWithUserUsecase.execute(debtId);
        if (!debtPaid) {
          throwError('Debt is required');
        }

        message = `Bạn đã được trả một khoản nợ ${debtPaid.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} từ ${
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

        let amount = calBalanceChange(transaction, user.bankAccount.id);

        if (user.bankAccount.id === transaction.remitterId) {
          message = `Tài khoản của bạn đã bị trừ ${amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} đến ${transaction.beneficiaryName}. Số dư hiện tại của bạn là ${user.bankAccount.balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;
          return message;
        }

        amount = calBalanceChange(transaction, user.id);
        if (user.bankAccount.id === transaction.beneficiaryId) {
          message = `Tài khoản của bạn đã được cộng +${amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} từ ${transaction.remitterName}. Số dư hiện tại của bạn là ${user.bankAccount.balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;
          return message;
        }
        return message;
      }
      default:
        throwError('Invalid notification type');
    }
  }
}
