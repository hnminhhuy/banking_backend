import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateTransactionUsecase,
  GetTransactionUsecase,
} from '../../../transactions/core/usecases';
import { AuthGuard } from '@nestjs/passport';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Route } from '../../../../decorators';
import { TransactionRouteByAnotherBank } from '../routes/transaction.route';
import { CreateTransactionForAnotherBankDto } from '../../../transactions/app/dtos';
import { TransactionModelParams } from '../../../transactions/core/models/transaction.model';
import { TransactionType } from '../../../transactions/core/enums/transaction_type';
import { TransactionStatus } from '../../../transactions/core/enums/transaction_status';
import { NotifyTransactionStatusDto } from '../dtos/notify_transaction_status.dto';
import { UpdateTransactionStatusUsecase } from '../../../transactions/core/usecases/update_transaction_status.usecase';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { BankCode } from '../../../bank/core/enums/bank_code';

@ApiTags(`Another Bank`)
@Controller({ path: 'api/another-bank/v1/transactions' })
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt_bank'))
export class TransactionController {
  constructor(
    private readonly createTransactionUsecase: CreateTransactionUsecase,
    private readonly getTransactionUsecase: GetTransactionUsecase,
    private readonly updateTransactionUsecase: UpdateTransactionStatusUsecase,
    private readonly getBankUsecase: GetBankUsecase,
    @InjectQueue('transaction-interbank-queue')
    private readonly queue: Queue,
    private readonly bankCode: BankCode,
  ) {}

  @Route(TransactionRouteByAnotherBank.createTransaction)
  async create(@Body() body: CreateTransactionForAnotherBankDto) {
    const bank = await this.getBankUsecase.execute(
      'id',
      body.beneficiaryBankId,
    );

    if (bank.code !== this.bankCode.DEFAULT) {
      throw new BadRequestException('Invalid bank default id');
    }

    const params: TransactionModelParams = {
      id: body.id,
      amount: body.amount,
      remitterId: body.remitterId,
      type: TransactionType.NORMAL,
      transactionFee: body.transactionFee,
      beneficiaryId: body.beneficiaryId,
      beneficiaryBankId: body.beneficiaryBankId,
      remitterPaidFee: body.remitterPaidFee,
      message: body.message,
      beneficiaryName: body.beneficiaryName,
      remitterBankId: body.remitterBankId,
      remitterName: body.remitterName,
      status: TransactionStatus.PROCESSING,
    };

    const transaction = await this.createTransactionUsecase.execute(params);

    await this.queue.add(transaction.id, {
      transaction: transaction,
    });

    return {
      data: transaction,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Route(TransactionRouteByAnotherBank.notifyTransactionStatus)
  async notify(@Body() body: NotifyTransactionStatusDto): Promise<boolean> {
    const transaction = await this.getTransactionUsecase.execute(
      'id',
      body.id,
      undefined,
    );

    if (!transaction) {
      throw new BadRequestException(`Transaction ${body.id} not found`);
    }

    return await this.updateTransactionUsecase.execute(
      transaction.id,
      TransactionStatus.FAILED,
    );
  }
}
