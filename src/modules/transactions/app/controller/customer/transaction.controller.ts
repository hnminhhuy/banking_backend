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
import { TransactionModelParams } from '../../../core/models/transaction.model';
import { Transactional } from 'typeorm-transactional';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { GetTransactionDto } from '../../dtos/get_transaction.dto';
import { GetUserUsecase } from '../../../../user/core/usecases';
import { TransactionCategory } from '../../../core/enums/transaction_category';
import {
  calculateAmountForBeneficiary,
  calculateAmountForRemitter,
} from '../../../core/helpers/calculate_amount';
import { PageParams, SortParams } from '../../../../../common/models';
import { TransactionSort } from '../../../core/enums/transaction_sort';
import { GetConfigUsecase } from '../../../../bank_config/core/usecase';
import { ConfigKey } from '../../../../bank_config/core/enum/config_key';
import {
  CreateOtpUsecase,
  VerifyOtpUsecase,
} from '../../../../otp/core/usecases';
import { OtpType } from '../../../../otp/core/enums/otpType.enum';
import { UpdateTransactionUsecase } from '../../../core/usecases/update_transaction.usecase';
import { TransactionStatus } from '../../../core/enums/transaction_status';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAnotherBankAccountInfoUsecase } from '../../../../another-bank/core/usecases/bank_account/get_another_bank_user.usecase';
import { GetBankUsecase } from '../../../../bank/core/usecases';
import { BankCode } from '../../../../bank/core/enums/bank_code';

@ApiTags(`Customer \\ Transactions`)
@ApiBearerAuth()
@Controller({ path: 'api/customers/v1/transactions' })
export class TransactionController {
  constructor(
    private readonly createTransactionUsecase: CreateTransactionUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly getTransactionUsecase: GetTransactionUsecase,
    private readonly listTransactionUsecase: ListTransactionUsecase,
    private readonly getConfigUsecase: GetConfigUsecase,
    private readonly createOtpUsecase: CreateOtpUsecase,
    private readonly verifyOtpUsecase: VerifyOtpUsecase,
    private readonly updateTransactionStatusUsecase: UpdateTransactionUsecase,
    private readonly getAnotherBankAccountInfoUsecase: GetAnotherBankAccountInfoUsecase,
    private readonly getBankUsecase: GetBankUsecase,
    private readonly bankCode: BankCode,
    @InjectQueue('transaction-queue')
    private readonly queue: Queue,
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

    if (remitter.balance < body.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    let beneficiary: any = undefined;

    const beneficiaryBank = await this.getBankUsecase.execute(
      'id',
      body.beneficiaryBankId,
    );
    if (!beneficiaryBank) {
      throw new BadRequestException(
        `Bank with ${body.beneficiaryBankId} not found`,
      );
    }

    let fee = undefined;

    switch (beneficiaryBank.code) {
      case this.bankCode.ANOTHER_BANK:
        beneficiary = await this.getAnotherBankAccountInfoUsecase.execute(
          body.beneficiaryId,
        );
        fee = (
          await this.getConfigUsecase.execute(
            ConfigKey.EXTERNAL_TRANSACTION_FEE,
          )
        ).getValue();
        break;
      case this.bankCode.DEFAULT:
        beneficiary = await this.getBankAccountUsecase.execute(
          'id',
          body.beneficiaryId,
          ['user'],
        );
        fee = (
          await this.getConfigUsecase.execute(
            ConfigKey.INTERNAL_TRANSACTION_FEE,
          )
        ).getValue();
        break;
      default:
        throw new BadRequestException('Invalid beneficiary bank id');
    }

    const params: TransactionModelParams = {
      amount: body.amount,
      remitterId: body.remitterId,
      type: TransactionType.NORMAL,
      transactionFee: fee,
      beneficiaryId: body.beneficiaryId,
      beneficiaryBankId: body.beneficiaryBankId,
      remitterPaidFee: body.remitterPaidFee,
      message: body.message,
      beneficiaryName: beneficiary.user?.fullName ?? beneficiary?.data.fullName,
      remitterBankId: remitter.bankId,
      remitterName: remitter.user.fullName,
    };

    const transaction = await this.createTransactionUsecase.execute(params);

    await this.createOtpUsecase.execute(OtpType.TRANSACTION, remitter.userId, {
      transactionId: transaction.id,
    });

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

    const transaction = await this.getTransactionUsecase.execute(
      'id',
      body.id,
      undefined,
    );

    if (!transaction) {
      throw new BadRequestException(`Transaction ${body.id} not found`);
    }

    if (transaction.status !== TransactionStatus.CREATED) {
      throw new BadRequestException(`Transaction ${body.id} cannot verify OTP`);
    }

    if (transaction.remitterId !== user.bankAccount.id) {
      throw new BadRequestException(
        `Transaction ${body.id} is not belong to you`,
      );
    }

    const res = await this.verifyOtpUsecase.execute(
      OtpType.TRANSACTION,
      user.id,
      body.otp,
      {
        transactionId: transaction.id,
      },
    );

    await this.updateTransactionStatusUsecase.execute(
      transaction.id,
      TransactionStatus.PROCESSING,
    );

    await this.queue.add(transaction.id, {
      transaction: transaction,
    });

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

    const transactionAmount = isRemitter
      ? calculateAmountForRemitter(transaction)
      : calculateAmountForBeneficiary(transaction);

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
      query.category === TransactionCategory.OUTCOMING
        ? userBankAccountId
        : undefined,
      query.category === TransactionCategory.INCOMING
        ? userBankAccountId
        : undefined,
      undefined,
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
