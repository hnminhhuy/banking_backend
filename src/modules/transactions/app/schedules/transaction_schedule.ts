import { Injectable } from '@nestjs/common';
import { HandleTimeoutTransactionUsecase } from '../../core/usecases/handle_timeout_transaction.usecase';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TransactionSchedule {
  constructor(
    private readonly handleTimeoutTransactionUsecase: HandleTimeoutTransactionUsecase,
  ) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  public async handleTimeout() {
    await this.handleTimeoutTransactionUsecase.execute();
  }
}
