import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
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
import { GetDebtWithUserUsecase } from '../../core/usecases/get_debt_with_user.usecase';
import { ListDebtWithUserUsecase } from '../../core/usecases/list_debt_with_user.usecase';

@ApiTags('Debt by Customer')
@Controller({ path: 'api/customer/v1/debt' })
export class DebtController {
  constructor(
    private readonly createDebtUsecase: CreateDebtUsecase,
    private readonly getDebtUsecase: GetDebtUsecase,
    private readonly getDebtWithUserUsecase: GetDebtWithUserUsecase,
    private readonly listDebtUsecase: ListDebtUsecase,
    private readonly listDebtWithUserUsecase: ListDebtWithUserUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly cancelDebtUsecase: CancelDebtUsecase,
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
  async getDebt(
    @Req() req,
    @Param() param: GetDebtDto,
    @Query('includeUser') includeUser: boolean = false,
  ) {
    const debt = includeUser
      ? await this.getDebtWithUserUsecase.execute(param.id)
      : await this.getDebtUsecase.execute('id', param.id);

    console.log('debt', debt);
    if (!debt) {
      throw new NotFoundException('Debt not found');
    }
    const bankAccount = await this.getBankAccountUsecase.execute(
      'id',
      debt.reminderId,
    );
    if (!bankAccount) {
      throw new NotFoundException('Bank Account not found');
    }

    if (req.user.authId !== bankAccount.userId)
      throw new ForbiddenException('You are not authorized to get this debt');
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
    console.log('Include user:', query.includeUser);
    const pageResult =
      query.includeUser?.toString() === 'true'
        ? await this.listDebtWithUserUsecase.execute(
            conditions,
            pageParams,
            sortParams,
          )
        : await this.listDebtUsecase.execute(
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
}