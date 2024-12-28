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
  GetTransactionUsecase,
  ListTransactionUsecase,
} from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import { TransactionRouteByCustomer } from '../../routes/customer/transaction.route';
import {
  CreateTransactionDto,
  ListTransactionDto,
  VerifyTransactionDto,
} from '../../dtos';
import { GetBankAccountUsecase } from '../../../../bank_account/core/usecases';
import { TransactionType } from '../../../core/enums/transaction_type';
import { Transactional } from 'typeorm-transactional';
import { GetTransactionDto } from '../../dtos/get_transaction.dto';
import { GetUserUsecase } from '../../../../user/core/usecases';
import { TransactionCategory } from '../../../core/enums/transaction_category';
import { calBalanceChange } from '../../../core/helpers/calculate_amount';
import { PageParams, SortParams } from '../../../../../common/models';
import { TransactionSort } from '../../../core/enums/transaction_sort';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNormalTransactionUsecase } from '../../../core/usecases/create_normal_transaction.usecase';
import { VerifyTransactionOtpUsecase } from '../../../core/usecases/verify_transaction_otp.usecase';

@ApiTags(`Customer \\ Transactions`)
@ApiBearerAuth()
@Controller({ path: 'api/customer/v1/transactions' })
export class TransactionController {
  constructor(
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly getTransactionUsecase: GetTransactionUsecase,
    private readonly listTransactionUsecase: ListTransactionUsecase,
    private readonly createNormalTransactionUsecase: CreateNormalTransactionUsecase,
    private readonly verifyTransactionOtpUsecase: VerifyTransactionOtpUsecase,
  ) {}

  @Route(TransactionRouteByCustomer.createTransaction)
  @Transactional()
  async create(@Req() req: any, @Body() body: CreateTransactionDto) {
    const remitter = await this.getBankAccountUsecase.execute(
      'id',
      body.remitterId,
      ['user'],
    );

    if (!remitter || remitter.userId !== req.user.authId) {
      throw new BadRequestException('This account does not belong to you');
    }

    const transaction = await this.createNormalTransactionUsecase.execute(
      remitter,
      body,
    );

    return {
      data: transaction,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Route(TransactionRouteByCustomer.verifyOtp)
  @Transactional()
  async verify(@Req() req: any, @Body() body: VerifyTransactionDto) {
    const user = await this.getUserUsecase.execute('id', req.user.authId, [
      'bankAccount',
    ]);

    if (!user) {
      throw new BadRequestException(`User ${req.user.authId} not found`);
    }

    const res = await this.verifyTransactionOtpUsecase.execute(user, body);

    return res;
  }

  @Route(TransactionRouteByCustomer.getTransaction)
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

    const transactionAmount = calBalanceChange(transaction, userBankAccountId);

    return {
      id: transaction.id,
      date: transaction.updatedAt,
      status: transaction.status,
      category: transactionCategory,
      amount: transactionAmount,
      message: transaction.message,
    };
  }

  @Route(TransactionRouteByCustomer.listTransaction)
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
      undefined,
      query.category === TransactionCategory.INCOMING
        ? undefined
        : userBankAccountId,
      query.category === TransactionCategory.OUTCOMING
        ? undefined
        : userBankAccountId,
      undefined,
      query.status ? [query.status] : undefined,
      query.category === TransactionCategory.DEBT
        ? TransactionType.DEBT
        : undefined,
      undefined,
    );

    let data = transactions.data.map((transaction) => {
      const isRemitter = transaction.remitterId === userBankAccountId;

      let transactionCategory = isRemitter
        ? TransactionCategory.OUTCOMING
        : TransactionCategory.INCOMING;

      if (transaction.type === TransactionType.DEBT) {
        transactionCategory = TransactionCategory.DEBT;
      }

      const transactionAmount = calBalanceChange(
        transaction,
        userBankAccountId,
      );

      return {
        id: transaction.id,
        date: transaction.updatedAt,
        status: transaction.status,
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
