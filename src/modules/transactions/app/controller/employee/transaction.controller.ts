import { BadRequestException, Controller, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetTransactionUsecase,
  ListTransactionUsecase,
} from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import { TransactionRouteByEmployee } from '../../routes/employee/transaction.route';
import { GetUserTransactionDto, ListTransactionDto } from '../../dtos';
import { PageParams, SortParams } from '../../../../../common/models';
import { TransactionSort } from '../../../core/enums/transaction_sort';
import { GetUserUsecase } from '../../../../user/core/usecases';
import { UserRole } from '../../../../user/core/enums/user_role';
import { TransactionCategory } from '../../../core/enums/transaction_category';
import {
  calculateAmountForBeneficiary,
  calculateAmountForRemitter,
} from '../../../core/helpers/calculate_amount';
import { TransactionStatus } from '../../../core/enums/transaction_status';

@ApiTags(`Employee \\ Transactions`)
@ApiBearerAuth()
@Controller({ path: 'api/employee/v1/transactions' })
export class TransactionController {
  constructor(
    private readonly getTransactionUsecase: GetTransactionUsecase,
    private readonly listTransactionUsecase: ListTransactionUsecase,
    private readonly getUserUsecase: GetUserUsecase,
  ) {}

  @Route(TransactionRouteByEmployee.listTransaction)
  async getList(
    @Query() query: ListTransactionDto,
    @Param() param: GetUserTransactionDto,
  ) {
    const user = await this.getUserUsecase.execute('id', param.userId, [
      'bankAccount',
    ]);

    if (!user) {
      throw new BadRequestException(`User ${param.userId} not found`);
    }

    if (user.role !== UserRole.Customer) {
      throw new BadRequestException(`User ${param.userId} is not customer`);
    }

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
        ? user?.bankAccount.id
        : undefined,
      query.category === TransactionCategory.INCOMING
        ? user?.bankAccount.id
        : undefined,
      undefined,
      query.status,
      undefined,
    );

    return {
      data: transactions.data,
      metadata: {
        page: transactions.page,
        totalCount: transactions.totalCount,
      },
    };
  }
}
