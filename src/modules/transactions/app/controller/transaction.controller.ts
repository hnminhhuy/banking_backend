import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import {
  CreateTransactionUsecase,
  GetTransactionUsecase,
  ListTransactionUsecase,
} from '../../core/usecases';
import { Route } from '../../../../decorators';
import { TransactionRoute } from '../routes/transaction.route';
import { CreateTransactionDto, ListTransactionDto } from '../dtos';
import { GetBankAccountUsecase } from '../../../bank_account/core/usecases';
import { TransactionType } from '../../core/enums/transaction_type';
import { TransactionModelParams } from '../../core/models/transaction.model';
import { Transactional } from 'typeorm-transactional';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { GetTransactionDto } from '../dtos/get_transaction.dto';
import { GetUserUsecase } from '../../../user/core/usecases';
import { TransactionCategory } from '../../core/enums/transaction_category';
import {
  calculateAmountForBeneficiary,
  calculateAmountForRemitter,
} from '../../core/helpers/calculate_amount';
import { query } from 'express';
import { PageParams, SortParams } from '../../../../common/models';
import { BankSort } from '../../../bank/core/enums/bank_sort';
import { TransactionSort } from '../../core/enums/transaction_sort';
import { GetConfigUsecase } from '../../../bank_config/core/usecase';
import { ConfigKey } from '../../../bank_config/core/enum/config_key';

@Controller({ path: 'api/customers/v1/transactions' })
export class TransactionController {
  constructor(
    private readonly createTransactionUsecase: CreateTransactionUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly getTransactionUsecase: GetTransactionUsecase,
    private readonly listTransactionUsecase: ListTransactionUsecase,
    private readonly getConfigUsecase: GetConfigUsecase,
    // @InjectQueue('transaction-queue')
    // private readonly queue: Queue,
  ) {}

  @Route(TransactionRoute.createTransaction)
  @Transactional()
  async create(@Req() req: any, @Body() body: CreateTransactionDto) {
    const remitter = await this.getBankAccountUsecase.execute(
      'id',
      body.remitterId,
    );

    if (remitter.balance < body.amount) {
      throw new BadRequestException('Insufficient balance');
    }

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

    const fee = (
      await this.getConfigUsecase.execute(ConfigKey.INTERNAL_TRANSACTION_FEE)
    ).getValue();

    const params: TransactionModelParams = {
      amount: body.amount,
      remitterId: body.remitterId,
      type: TransactionType.NORMAL,
      transactionFee: fee,
      beneficiaryId: beneficiary.id,
      beneficiaryBankId: beneficiary.bankId,
      remitterPaidFee: body.remitterPaidFee,
      message: body.message,
      beneficiaryName: beneficiary.user?.fullName,
    };

    const transaction = await this.createTransactionUsecase.execute(params);

    // await this.queue.add(transaction.id, { transaction: transaction });

    return {
      data: transaction,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Route(TransactionRoute.getTransaction)
  async get(@Req() req: any, @Param() param: GetTransactionDto) {
    const transaction = await this.getTransactionUsecase.execute(
      'id',
      param.id,
      undefined,
    );

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const user = await this.getUserUsecase.execute('id', req.user.authId, [
      'bankAccount',
    ]);

    const userBankAccountId = user.bankAccount.id;

    const isUserInvolvedInTransaction =
      transaction.remitterId === userBankAccountId ||
      transaction.beneficiaryId === userBankAccountId;

    if (!isUserInvolvedInTransaction) {
      throw new BadRequestException('This transaction does not belong to you');
    }

    const isRemitter = transaction.remitterId === userBankAccountId;

    const transactionCategory = isRemitter
      ? TransactionCategory.OUTCOMING
      : TransactionCategory.INCOMING;

    const transactionAmount = isRemitter
      ? calculateAmountForRemitter(transaction)
      : calculateAmountForBeneficiary(transaction);

    return {
      id: transaction.id,
      date: transaction.updatedAt,
      category: transactionCategory,
      amount: transactionAmount,
      message: transaction.message,
    };
  }

  @Route(TransactionRoute.listTransaction)
  async list(@Req() req: any, @Query() query: ListTransactionDto) {
    const user = await this.getUserUsecase.execute('id', req.user.authId, [
      'bankAccount',
    ]);

    const userBankAccountId = user.bankAccount.id;
    const pageParams = new PageParams(
      query.page,
      query.limit,
      query.needTotalCount,
      query.onlyCount,
    );

    const sortParams: SortParams<TransactionSort> = new SortParams(
      query.sort as TransactionSort,
      query.direction,
    );

    const transactions = await this.listTransactionUsecase.execute(
      pageParams,
      sortParams,
      query.category === TransactionCategory.OUTCOMING
        ? userBankAccountId
        : undefined,
      query.category === TransactionCategory.INCOMING
        ? userBankAccountId
        : undefined,
      query.status,
      undefined,
    );

    let data = transactions.data.map((transaction) => {
      const isRemitter = transaction.remitterId === userBankAccountId;

      const transactionCategory = isRemitter
        ? TransactionCategory.OUTCOMING
        : TransactionCategory.INCOMING;

      const transactionAmount = isRemitter
        ? calculateAmountForRemitter(transaction)
        : calculateAmountForBeneficiary(transaction);

      return {
        id: transaction.id,
        date: transaction.updatedAt,
        category: transactionCategory,
        amount: transactionAmount,
        message: transaction.message,
      };
    });

    return {
      data: data,
      metadata: {
        page: transactions.page,
        totalCount: transactions.totalCount,
      },
    };
  }
}
