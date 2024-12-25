import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Route } from 'src/decorators';
import { DebtRoute } from '../routes/debt.route';
import { CreateDebtDto, GetDebtDto } from '../dtos/debt.dto';
import { DebtModelParams } from '../../core/models/debt.model';
import { PageParams, SortParams } from 'src/common/models';
import { DebtSort } from '../../core/enum/debt_sort';
import { ListDebtDto } from '../dtos/list_debt.dto';
import { GetBankAccountUsecase } from 'src/modules/bank_account/core/usecases';
import { DebtCategory } from '../../core/enum/debt_category';
import {
  CancelDebtUsecase,
  CreateDebtUsecase,
  GetDebtUsecase,
  ListDebtUsecase,
} from '../../core/usecases';
import { CreateTransactionUsecase } from '../../../transactions/core/usecases';
import { GetConfigUsecase } from '../../../bank_config/core/usecase';
import { ConfigKey } from '../../../bank_config/core/enum/config_key';
import { TransactionModelParams } from '../../../transactions/core/models/transaction.model';
import { TransactionType } from '../../../transactions/core/enums/transaction_type';
import { CreateOtpUsecase } from '../../../otp/core/usecases';
import { OtpType } from '../../../otp/core/enums/otpType.enum';

@ApiTags('Debt by Customer')
@Controller({ path: 'api/customer/v1/debt' })
export class DebtController {
  constructor(
    private readonly createDebtUsecase: CreateDebtUsecase,
    private readonly getDebtUsecase: GetDebtUsecase,
    private readonly listDebtUsecase: ListDebtUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly cancelDebtUsecase: CancelDebtUsecase,
    private readonly createTransactionUsecase: CreateTransactionUsecase,
    private readonly getConfigUsecase: GetConfigUsecase,
    private readonly createOtpUsecase: CreateOtpUsecase,
  ) {}
  @Route(DebtRoute.createDebt)
  async createDebt(@Req() req, @Body() body: CreateDebtDto) {
    const debtParams: DebtModelParams = {
      debtorId: body.debtorId,
      amount: body.amount,
      message: body.message,
    };

    try {
      const data = await this.createDebtUsecase.execute(
        req.user.authId,
        debtParams,
      );

      if (!data) {
        throw new InternalServerErrorException('Failed to create debt record');
      }

      return {
        data,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      if (error.message === 'ReminderNotFoundError') {
        throw new NotFoundException('Reminder account not found');
      }
      if (error.message === 'DebtorNotFoundError') {
        throw new NotFoundException('Debtor account not found');
      }
      if (error.message === 'CannotCreateDebtForSelfError') {
        throw new BadRequestException('Cannot create debt for yourself');
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Route(DebtRoute.getDebt)
  async getDebt(@Req() req: any, @Param() param: GetDebtDto) {
    const debt = await this.getDebtUsecase.execute('id', param.id);
    if (!debt) {
      throw new NotFoundException('Debt not found');
    }
    const bankAccount = await this.getBankAccountUsecase.execute(
      'id',
      debt.reminderId,
      ['user'],
    );

    if (bankAccount.user.id !== req.user.authId) {
      throw new BadRequestException('Debt does not belong to the user');
    }
    return {
      debt,
      statusCode: 200,
    };
  }

  @Route(DebtRoute.listDebt)
  async listDebt(@Req() req, @Query() query: ListDebtDto) {
    const pageParams = new PageParams(
      query.page,
      query.limit,
      query.needTotalCount,
      query.onlyCount,
    );
    const sortParams: SortParams<DebtSort> = new SortParams(
      (query.sort as DebtSort) ?? DebtSort.CREATED_AT,
      query.direction,
    );

    const bankAccount = await this.getBankAccountUsecase.execute(
      'user_id',
      req.user.authId,
    );
    if (!bankAccount) throw new NotFoundException('Bank account not found');

    const conditions: Partial<DebtModelParams> = {
      reminderId: undefined,
      debtorId: undefined,
      amount: query.amount,
      status: query.status,
    };

    if (query.category === DebtCategory.CREATED_BY_ME) {
      conditions.reminderId = bankAccount.id;
    } else if (query.category === DebtCategory.CREATED_FOR_ME) {
      conditions.debtorId = bankAccount.id;
    }

    const pageResult = await this.listDebtUsecase.execute(
      conditions,
      pageParams,
      sortParams,
    );

    return {
      data: pageResult.data,
      metadata: {
        page: pageResult.page,
        totalCount: pageResult.totalCount,
      },
    };
  }

  @Route(DebtRoute.cancelDebt)
  async cancelDebt(@Req() req, @Param() param: GetDebtDto) {
    try {
      // Execute use case to cancel debt
      const result = await this.cancelDebtUsecase.execute(
        req.user.authId,
        param.id,
      );

      // Return success response
      return {
        statusCode: HttpStatus.OK,
        message: 'Debt successfully canceled',
        data: result,
      };
    } catch (error) {
      // Handle specific errors
      switch (error.message) {
        case 'AccountNotFoundError':
          throw new NotFoundException('User bank account not found');
        case 'DebtNotFoundError':
          throw new NotFoundException('Debt not found');
        case 'DebtNotBelongToUserError':
          throw new BadRequestException('Debt does not belong to the user');
        case 'DebtAlreadyCanceledError':
          throw new ConflictException('Debt is already canceled');
        case 'DebtCannotBeCancelledError':
          throw new ConflictException(
            'Debt cannot be canceled due to its current status',
          );
        case 'DebtCancelFailedError':
          throw new InternalServerErrorException('Failed to cancel the debt');
        default:
          // Generic error fallback
          throw new InternalServerErrorException(
            'An unexpected error occurred',
          );
      }
    }
  }

  @Route(DebtRoute.settleDebt)
  async settleDebt(@Req() req, @Param() param: GetDebtDto) {
    const debt = await this.getDebtUsecase.execute('id', param.id);
    if (!debt) {
      throw new NotFoundException('Debt not found');
    }

    if (debt.reminderId === req.user.authId) {
      throw new BadRequestException('Debt cannot be settled by the reminder');
    }

    const debtorAccount = await this.getBankAccountUsecase.execute(
      'id',
      debt.debtorId,
      ['user'],
    );

    if (debtorAccount.user.id !== req.user.authId) {
      throw new BadRequestException('Debt does not belong to the user');
    }

    const fee = (
      await this.getConfigUsecase.execute(ConfigKey.INTERNAL_TRANSACTION_FEE)
    ).getValue();

    if (debtorAccount.balance + fee < debt.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const reminderAccount = await this.getBankAccountUsecase.execute(
      'id',
      debt.reminderId,
      ['user'],
    );

    const params: TransactionModelParams = {
      amount: debt.amount,
      remitterId: debt.debtorId,
      type: TransactionType.DEBT,
      transactionFee: fee,
      beneficiaryId: debt.reminderId,
      beneficiaryBankId: reminderAccount.bankId,
      remitterPaidFee: true,
      message: debt.message,
      beneficiaryName: reminderAccount.user?.fullName,
      remitterBankId: debtorAccount.bankId,
      remitterName: debtorAccount.user.fullName,
      debtId: debt.id,
    };

    const transaction = await this.createTransactionUsecase.execute(params);

    await this.createOtpUsecase.execute(
      OtpType.TRANSACTION,
      debtorAccount.user.id,
      {
        transactionId: transaction.id,
      },
    );

    return {
      data: transaction,
      statusCode: HttpStatus.CREATED,
    };
  }
}
