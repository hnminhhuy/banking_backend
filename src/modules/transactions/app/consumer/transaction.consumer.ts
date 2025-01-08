import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  ChangeBalanceUsecase,
  GetBankAccountUsecase,
} from '../../../bank_account/core/usecases';
import { Transactional } from 'typeorm-transactional';
import { UpdateDebtUsecase } from '../../../debt/core/usecases/update_debt.usecase';
import { TransactionType } from '../../core/enums/transaction_type';
import { DebtStatus } from '../../../debt/core/enum/debt_status';
import {
  CreditBeneficiaryUsecase,
  ProcessInterBankTransactionUsecase,
} from '../../core/usecases';
import { SendPushNotificationUseCase } from '../../../notifications/core/usecases/send_push_notification.usecase';
import { NotificationType } from '../../../notifications/core/enums/notification_type';
import { TransactionGateway } from '../../infra/transaction_websocket';

@Processor('transaction-queue', { concurrency: 1 })
export class TransactionConsumer extends WorkerHost {
  constructor(
    private readonly changeBalanceUsecase: ChangeBalanceUsecase,
    private readonly updateDebtUsecase: UpdateDebtUsecase,
    private readonly creditBeneficiaryUsecase: CreditBeneficiaryUsecase,
    private readonly processInterBankTransactionUsecase: ProcessInterBankTransactionUsecase,
    private readonly sendPushNotificationUsecase: SendPushNotificationUseCase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly transactionGateway: TransactionGateway,
  ) {
    super();
  }

  // @Transactional()
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

    await this.changeBalanceUsecase.execute(remitterId, -remitterAmount);

    const beneficiary = await this.getBankAccountUsecase.execute(
      'id',
      beneficiaryId,
      ['user'],
    );

    if (remitterBankId === beneficiaryBankId) {
      await this.creditBeneficiaryUsecase.execute(
        id,
        beneficiaryId,
        beneficiaryAmount,
      );
      await this.sendPushNotificationUsecase
        .execute(
          beneficiary?.userId,
          NotificationType.BALANCE_UPDATE,
          undefined,
          transaction.id,
        )
        .then((res) => {
          console.log('Debt balance for beneficiary', res);
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      await this.processInterBankTransactionUsecase.execute(transaction);
    }

    const remitter = await this.getBankAccountUsecase.execute('id', remitterId);

    await this.sendPushNotificationUsecase
      .execute(
        remitter?.userId,
        NotificationType.BALANCE_UPDATE,
        undefined,
        transaction.id,
      )
      .then((res) => {
        console.log('Debt balance for remitter', res);
      })
      .catch((error) => {
        console.log(error.message);
      });

    if (type === TransactionType.DEBT) {
      await this.updateDebtUsecase.execute(debtId, DebtStatus.Settled);

      await this.sendPushNotificationUsecase
        .execute(
          beneficiary?.userId,
          NotificationType.DEBT_CREATED_FOR_YOU,
          undefined,
          transaction.id,
        )
        .then((res) => {
          console.log('Notification success debt', res);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }
}
