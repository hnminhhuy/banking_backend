import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDebtUsecase } from '../../core/usecases';
import { Route } from 'src/decorators';
import { DebtRoute } from '../routes/debt.route';
import { CreateDebtDto, GetDebtDto } from '../dtos/debt.dto';
import { DebtModelParams } from '../../core/models/debt.model';
import { AuthGuard } from '@nestjs/passport';
import { GetDebtUsecase } from '../../core/usecases/get_debt.usecase';
import { PageParams, SortParams } from 'src/common/models';
import { DebtSort } from '../../core/enum/debt_sort';
import { ListDebtUsecase } from '../../core/usecases/list_user.usecase';
import { ListDebtDto } from '../dtos/list_debt.dto';
import { GetBankAccountUsecase } from 'src/modules/bank_account/core/usecases';
import { DebtCategory } from '../../core/enum/debt_category';

@ApiTags('Debt by Customer')
@Controller({ path: 'api/customer/v1/debt' })
export class DebtController {
  constructor(
    private readonly createDebtUsecase: CreateDebtUsecase,
    private readonly getDebtUsecase: GetDebtUsecase,
    private readonly listDebtUsecase: ListDebtUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
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
        data: data,
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
  async getDebt(@Param() param: GetDebtDto) {
    const debt = await this.getDebtUsecase.execute('id', param.id);
    if (!debt) {
      throw new NotFoundException('Debt not found');
    }
    return {
      data: debt,
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

    // if (query.id !== undefined && query.id !== null) {
    //   conditions.id = query.id;
    // }
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
}
