import {
  BadRequestException,
  Body,
  Controller,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTransactionUsecase } from '../../../transactions/core/usecases';
import { AuthGuard } from '@nestjs/passport';
import { Route } from '../../../../decorators';
import { TransactionRouteByExternalBank } from '../routes/transaction.route';
import { CreateTransactionForExternalBankDto } from '../../../transactions/app/dtos';
import { TransactionModelParams } from '../../../transactions/core/models/transaction.model';
import { TransactionType } from '../../../transactions/core/enums/transaction_type';
import { TransactionStatus } from '../../../transactions/core/enums/transaction_status';
import { UpdateTransactionUsecase } from '../../../transactions/core/usecases/update_transaction.usecase';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { BankCode } from '../../../bank/core/enums/bank_code';
import {
  ChangeBalanceUsecase,
  GetBankAccountUsecase,
} from '../../../bank_account/core/usecases';
import { Transactional } from 'typeorm-transactional';
import { SendPushNotificationUseCase } from '../../../notifications/core/usecases/send_push_notification.usecase';
import { NotificationType } from '../../../notifications/core/enums/notification_type';

@ApiTags(`External Bank`)
@Controller({ path: 'api/external-bank/v1/transactions' })
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt_bank'))
export class TransactionController {
  constructor(
    private readonly createTransactionUsecase: CreateTransactionUsecase,
    private readonly updateTransactionUsecase: UpdateTransactionUsecase,
    private readonly changeBalanceUsecase: ChangeBalanceUsecase,
    private readonly getBankUsecase: GetBankUsecase,
    private readonly bankCode: BankCode,
    private readonly sendPushNotificationUsecase: SendPushNotificationUseCase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
  ) {}

  @Transactional()
  @Route(TransactionRouteByExternalBank.createTransaction)
  async create(
    @Req() req: any,
    @Body() body: CreateTransactionForExternalBankDto,
  ) {
    const beneficiaryBank = await this.getBankUsecase.execute(
      'code',
      this.bankCode.DEFAULT,
    );

    const remitterBank = await this.getBankUsecase.execute(
      'id',
      req.user.authId,
    );

    const params: TransactionModelParams = {
      id: body.id,
      amount: body.amount,
      remitterId: body.remitterId,
      type: TransactionType.NORMAL,
      transactionFee: body.transactionFee,
      beneficiaryId: body.beneficiaryId,
      beneficiaryBankId: beneficiaryBank.id,
      remitterPaidFee: body.remitterPaidFee,
      message: body.message,
      beneficiaryName: body.beneficiaryName,
      remitterBankId: remitterBank.id,
      remitterName: body.remitterName,
      status: TransactionStatus.PROCESSING,
    };

    const transaction = await this.createTransactionUsecase.execute(params);
    try {
      await this.changeBalanceUsecase.execute(
        transaction.beneficiaryId,
        transaction.remitterPaidFee
          ? transaction.amount
          : transaction.amount - transaction.transactionFee,
      );
      await this.updateTransactionUsecase.execute(
        transaction.id,
        TransactionStatus.SUCCESS,
      );

      const beneficiaryAccount = await this.getBankAccountUsecase.execute(
        'id',
        transaction.beneficiaryId,
      );

      await this.sendPushNotificationUsecase
        .execute(
          beneficiaryAccount?.userId,
          NotificationType.BALANCE_UPDATE,
          undefined,
          transaction.id,
        )
        .then(() => {
          console.log('Push notification sent');
        })
        .catch((error) => {
          console.log(error.message);
        });
    } catch (error) {
      await this.updateTransactionUsecase.execute(
        transaction.id,
        TransactionStatus.FAILED,
      );
      throw new BadRequestException(error.message);
    }

    return true;
  }
}
