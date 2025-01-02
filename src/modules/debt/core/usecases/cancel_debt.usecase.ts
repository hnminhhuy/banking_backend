import { Injectable } from '@nestjs/common';
import { IDebtRepo } from '../repositories/debt.irepo';
import { GetBankAccountUsecase } from 'src/modules/bank_account/core/usecases';
import { DebtStatus } from '../enum/debt_status';
import { GetDebtUsecase } from '.';
import { SendPushNotificationUseCase } from '../../../notifications/core/usecases/send_push_notification.usecase';
import { NotificationType } from '../../../notifications/core/enums/notification_type';

@Injectable()
export class CancelDebtUsecase {
  constructor(
    private readonly iDebtRepo: IDebtRepo,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getDebtUsecase: GetDebtUsecase,
    private readonly sendPushNotificationUsecase: SendPushNotificationUseCase,
  ) {}
  public async execute(userId: string, debtId: string): Promise<boolean> {
    // Check if user has a bank account
    const bankAccountUser = await this.getBankAccountUsecase.execute(
      'user_id',
      userId,
    );
    if (!bankAccountUser) {
      throw new Error('AccountNotFoundError');
    }

    // Check if debt exists
    const debt = await this.getDebtUsecase.execute('id', debtId);
    if (!debt) {
      throw new Error('DebtNotFoundError');
    }

    // Check ownership of the debt
    if (debt.reminderId !== bankAccountUser.id) {
      throw new Error('DebtNotBelongToUserError');
    }

    // Check if debt is already canceled
    if (debt.status === DebtStatus.Canceled) {
      throw new Error('DebtAlreadyCanceledError');
    }

    // Check if debt is cancellable
    if (debt.status !== DebtStatus.Indebted) {
      throw new Error('DebtCannotBeCancelledError');
    }

    // Cancel the debt
    const result = await this.iDebtRepo.cancelDebt(debtId);
    if (!result) {
      throw new Error('DebtCancelFailedError');
    }

    const beneficiary = await this.getBankAccountUsecase.execute(
      'id',
      debt.debtorId,
    );

    await this.sendPushNotificationUsecase
      .execute(
        beneficiary?.userId,
        NotificationType.DEBT_CANCEL,
        debt.id,
        undefined,
      )
      .then(() => {
        console.log('Push notification sent');
      })
      .catch((error) => {
        console.log(error.message);
      });

    return result;
  }
}
