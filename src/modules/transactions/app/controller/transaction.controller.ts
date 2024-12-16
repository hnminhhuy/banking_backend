import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CreateTransactionUsecase } from '../../core/usecases';
import { Route } from '../../../../decorators';
import { TransactionRoute } from '../routes/transaction.route';
import { CreateTransactionDto } from '../dtos';
import { GetBankAccountUsecase } from '../../../bank_account/core/usecases';
import { TransactionType } from '../../core/enums/transaction_type';
import { TransactionModelParams } from '../../core/models/transaction.model';

@Controller({ path: 'api/customers/v1/transactions' })
export class TransactionController {
  constructor(
    private readonly createTransactionUsecase: CreateTransactionUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
  ) {}

  @Route(TransactionRoute.createTransaction)
  async create(@Req() req: any, @Body() body: CreateTransactionDto) {
    const remitter = await this.getBankAccountUsecase.execute(
      'id',
      body.remitterId,
    );
    if (remitter.userId !== req.user.authId) {
      throw new BadRequestException('This account does not belong to you');
    }
    const beneficiary = await this.getBankAccountUsecase.execute(
      'id',
      body.beneficiaryId,
      ['user'],
    );

    if (!beneficiary || beneficiary.bankId !== body.beneficiaryBankId) {
      throw new NotFoundException(
        `Can not found beneficiary with ${body.beneficiaryId}`,
      );
    }
    const params: TransactionModelParams = {
      amount: body.amount,
      remitterId: body.remitterId,
      type: TransactionType.NORMAL,
      transactionFee: 0, // fix later when have configs
      beneficiaryId: beneficiary.id,
      beneficiaryBankId: beneficiary.bankId,
      remitterPaidFee: body.remitterPaidFee,
      message: body.message,
      status: undefined,
      beneficiaryName: beneficiary.user?.fullName,
    };

    const transaction = await this.createTransactionUsecase.execute(params);

    return {
      data: transaction,
      statusCode: HttpStatus.CREATED,
    };
  }
}
