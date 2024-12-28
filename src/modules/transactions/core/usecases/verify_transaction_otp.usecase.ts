import { BadRequestException, Injectable } from '@nestjs/common';
import { GetTransactionUsecase } from './get_transaction.usecase';
import { VerifyOtpUsecase } from '../../../otp/core/usecases';
import { UpdateTransactionUsecase } from './update_transaction.usecase';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { VerifyTransactionDto } from '../../app/dtos';
import { OtpType } from '../../../otp/core/enums/otpType.enum';
import { TransactionStatus } from '../enums/transaction_status';
import { UserModel } from '../../../user/core/models/user.model';

@Injectable()
export class VerifyTransactionOtpUsecase {
  constructor(
    private readonly getTransactionUsecase: GetTransactionUsecase,
    private readonly verifyOtpUsecase: VerifyOtpUsecase,
    private readonly updateTransactionUsecase: UpdateTransactionUsecase,
    @InjectQueue('transaction-queue')
    private readonly queue: Queue,
  ) {}

  public async execute(
    user: UserModel,
    verifyTransactionDto: VerifyTransactionDto,
  ): Promise<boolean> {
    const transaction = await this.getTransactionUsecase.execute(
      'id',
      verifyTransactionDto.id,
      undefined,
    );

    if (!transaction) {
      throw new BadRequestException(
        `Transaction ${verifyTransactionDto.id} not found`,
      );
    }

    if (transaction.status !== TransactionStatus.CREATED) {
      throw new BadRequestException(
        `Transaction ${verifyTransactionDto.id} cannot verify OTP`,
      );
    }

    if (transaction.remitterId !== user.bankAccount.id) {
      throw new BadRequestException(
        `Transaction ${verifyTransactionDto.id} is not belong to you`,
      );
    }

    const res = await this.verifyOtpUsecase.execute(
      OtpType.TRANSACTION,
      user.id,
      verifyTransactionDto.otp,
      {
        transactionId: transaction.id,
      },
    );

    await this.updateTransactionUsecase.execute(
      transaction.id,
      TransactionStatus.PROCESSING,
    );

    await this.queue.add(transaction.id, {
      transaction: transaction,
    });

    return res;
  }
}
