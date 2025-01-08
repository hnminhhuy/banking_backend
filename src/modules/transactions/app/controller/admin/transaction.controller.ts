import { BadRequestException, Controller, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListTransactionUsecase } from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import { TransactionRouteByAdmin } from '../../routes/admin/admin.route';
import { ReconcileTransactionDto, StatisticTransactionDto } from '../../dtos';
import {
  DateFilter,
  PageParams,
  SortParams,
} from '../../../../../common/models';
import { TransactionSort } from '../../../core/enums/transaction_sort';
import { StatisticTransactionUsecase } from '../../../core/usecases/statistic_transaction.usecase';
import { GetBankUsecase } from '../../../../bank/core/usecases';
import { DateParamsDto } from 'src/common/dtos';

@ApiTags('Admin \\ Transaction')
@ApiBearerAuth()
@Controller({ path: 'api/admin/v1/transactions' })
export class TransactionController {
  constructor(
    private readonly listTransactionUsecase: ListTransactionUsecase,
    private readonly getBankUsecase: GetBankUsecase,
    private readonly statisticTransactionUsecase: StatisticTransactionUsecase,
  ) {}

  @Route(TransactionRouteByAdmin.reconcileTransaction)
  async reconcile(@Query() query: ReconcileTransactionDto) {
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

    const dateFilterParams = new DateFilter(query.from, query.to, query.column);

    const transactions = await this.listTransactionUsecase.execute(
      pageParams,
      sortParams,
      dateFilterParams,
      undefined,
      undefined,
      query.bankId,
      query.status ? [query.status] : undefined,
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

  @Route(TransactionRouteByAdmin.statisticTransaction)
  async statistic(
    @Param() param: StatisticTransactionDto,
    @Query() dateFilterParams: DateParamsDto,
  ) {
    const externalBank = await this.getBankUsecase.execute('id', param.bankId);
    const dateFilter = new DateFilter(
      dateFilterParams.from,
      dateFilterParams.to,
      dateFilterParams.column,
    );

    if (!externalBank) {
      throw new BadRequestException('Bank not found');
    }

    return await this.statisticTransactionUsecase.execute(
      externalBank,
      dateFilter,
    );
  }
}
