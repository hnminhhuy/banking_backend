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
import {
  CreateTransactionForExternalBankDto,
  TransactionData,
} from '../../../transactions/app/dtos';
import { TransactionModelParams } from '../../../transactions/core/models/transaction.model';
import { TransactionType } from '../../../transactions/core/enums/transaction_type';
import { TransactionStatus } from '../../../transactions/core/enums/transaction_status';
import { UpdateTransactionUsecase } from '../../../transactions/core/usecases/update_transaction.usecase';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { BankCode } from '../../../bank/core/enums/bank_code';
import { ChangeBalanceUsecase } from '../../../bank_account/core/usecases';
import { Transactional } from 'typeorm-transactional';
import { JwtService } from '@nestjs/jwt';
import { Algorithm } from 'jsonwebtoken';

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
    private readonly jwtService: JwtService,
    private readonly bankCode: BankCode,
  ) {}

  @Transactional()
  @Route(TransactionRouteByExternalBank.createTransaction)
  async create(@Req() req: any, @Body() body: TransactionData) {
    const remitterBank = await this.getBankUsecase.execute(
      'id',
      req.user.authId,
    );
    let createTransactionDto: CreateTransactionForExternalBankDto = undefined;
    try {
      createTransactionDto = this.jwtService.verify(body.data, {
        publicKey: remitterBank.publicKey,
        algorithms: [remitterBank.alogrithm as Algorithm],
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const beneficiaryBank = await this.getBankUsecase.execute(
      'code',
      this.bankCode.DEFAULT,
    );

    const params: TransactionModelParams = {
      id: createTransactionDto.id,
      amount: createTransactionDto.amount,
      remitterId: createTransactionDto.remitterId,
      type: TransactionType.NORMAL,
      transactionFee: createTransactionDto.transactionFee,
      beneficiaryId: createTransactionDto.beneficiaryId,
      beneficiaryBankId: beneficiaryBank.id,
      remitterPaidFee: createTransactionDto.remitterPaidFee,
      message: createTransactionDto.message,
      beneficiaryName: createTransactionDto.beneficiaryName,
      remitterBankId: remitterBank.id,
      remitterName: createTransactionDto.remitterName,
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
