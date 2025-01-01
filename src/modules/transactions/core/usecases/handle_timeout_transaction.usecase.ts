import { Injectable } from '@nestjs/common';
import { ListTransactionUsecase } from './list_transaction.usecase';
import {
  DateFilter,
  Page,
  PageParams,
  SortParams,
} from '../../../../common/models';
import { TransactionModel } from '../models/transaction.model';
import { TransactionSort } from '../enums/transaction_sort';
import { SORT_DIRECTION } from '../../../../common/enums';
import { TransactionStatus } from '../enums/transaction_status';
import { UpdateTransactionsUsecase } from './update_transactions_status.usecase';
import { SendPushNotificationUseCase } from '../../../notifications/core/usecases/send_push_notification.usecase';
import { GetBankAccountUsecase } from '../../../bank_account/core/usecases';
import { NotificationType } from '../../../notifications/core/enums/notification_type';

@Injectable()
export class HandleTimeoutTransactionUsecase {
  constructor(
    private readonly listTransactionUsecase: ListTransactionUsecase,
    private readonly updateTransactionsUsecase: UpdateTransactionsUsecase,
    private readonly sendPushNotificationUsecase: SendPushNotificationUseCase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
  ) {}

  public async execute(): Promise<void> {
    const now = new Date();
    const transactionTimeout = new Date(now.getTime() - 10 * 60 * 1000); // 2 phut
    const dateFilterParams = new DateFilter(
      undefined,
      transactionTimeout,
      'createdAt',
    );

    let currentPage = 1;
    const pageSize = 20;
    let page: Page<TransactionModel> | undefined;

    do {
      const pageParams = new PageParams(currentPage, pageSize, false, false);
      const sortParams = new SortParams<TransactionSort>(
        TransactionSort.CREATED_AT,
        SORT_DIRECTION.ASC,
      );

      page = await this.listTransactionUsecase.execute(
        pageParams,
        sortParams,
        dateFilterParams,
        undefined,
        undefined,
        undefined,
        [TransactionStatus.CREATED, TransactionStatus.PROCESSING],
        undefined,
        undefined,
      );

      const transactions = page.data;

      if (transactions.length !== 0) {
        await this.updateTransactionsUsecase.execute(
          transactions,
          TransactionStatus.FAILED,
        );
      }

      transactions.forEach(async (transaction) => {
        if (transaction.status === TransactionStatus.PROCESSING) {
          const remitterAccount = await this.getBankAccountUsecase.execute(
            'id',
            transaction.remitterId,
          );
          this.sendPushNotificationUsecase
            .execute(
              remitterAccount?.userId,
              NotificationType.TRANSACTION_FAILED,
              undefined,
              transaction.id,
            )
            .then(() => {
              console.log('Push notification sent');
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
      });
      currentPage++;
    } while (page && page.data.length === pageSize);
  }
}
