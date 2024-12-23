import { Controller, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListTransactionUsecase } from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import { TransactionRouteByAdmin } from '../../routes/admin/admin.route';
import { ReconcileTransactionDto } from '../../dtos';
import {
  DateFilter,
  PageParams,
  SortParams,
} from '../../../../../common/models';
import { TransactionSort } from '../../../core/enums/transaction_sort';

@ApiTags('Admin \\ Transaction')
@ApiBearerAuth()
@Controller({ path: 'api/admin/v1/transactions' })
export class TransactionController {
  constructor(
    private readonly listTransactionUsecase: ListTransactionUsecase,
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
