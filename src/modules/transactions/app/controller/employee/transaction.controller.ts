import {
  BadRequestException,
  Controller,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListTransactionUsecase } from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import { TransactionRouteByEmployee } from '../../routes/employee/transaction.route';
import { GetUserTransactionDto, ListTransactionDto } from '../../dtos';
import {
  DateFilter,
  PageParams,
  SortParams,
} from '../../../../../common/models';
import { TransactionSort } from '../../../core/enums/transaction_sort';
import { GetUserUsecase } from '../../../../user/core/usecases';
import { UserRole } from '../../../../user/core/enums/user_role';
import { TransactionCategory } from '../../../core/enums/transaction_category';
import { calBalanceChange } from '../../../core/helpers/calculate_amount';
import { TransactionType } from '../../../core/enums/transaction_type';

@ApiTags(`Employee \\ Transactions`)
@ApiBearerAuth()
@Controller({ path: 'api/employee/v1/transactions' })
export class TransactionController {
  constructor(
    private readonly listTransactionUsecase: ListTransactionUsecase,
    private readonly getUserUsecase: GetUserUsecase,
  ) {}

  @Route(TransactionRouteByEmployee.listTransactionByCustomer)
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

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const datefilter = new DateFilter(
      thirtyDaysAgo,
      new Date(),
      TransactionSort.COMPLETED_AT,
    );

    const transactions = await this.listTransactionUsecase.execute(
      pageParams,
      sortParams,
      datefilter,
      query.category === TransactionCategory.INCOMING
        ? undefined
        : user.bankAccount.id,
      query.category === TransactionCategory.OUTCOMING
        ? undefined
        : user.bankAccount.id,
      undefined,
      query.status ? [query.status] : undefined,
      query.category === TransactionCategory.DEBT
        ? TransactionType.DEBT
        : undefined,
      undefined,
    );

    const data = transactions.data.map((transaction) => {
      const isRemitter = transaction.remitterId === user.bankAccount.id;

      let transactionCategory = isRemitter
        ? TransactionCategory.OUTCOMING
        : TransactionCategory.INCOMING;

      if (transaction.type === TransactionType.DEBT) {
        transactionCategory = TransactionCategory.DEBT;
      }

      const transactionAmount = calBalanceChange(
        transaction,
        user.bankAccount.id,
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

  @Route(TransactionRouteByEmployee.listTransaction)
  async list(@Req() req: any, @Query() query: ListTransactionDto) {
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
      undefined,
      undefined,
      undefined,
      query.status ? [query.status] : undefined,
      undefined,
      ['remitterBank', 'beneficiaryBank'],
    );

    let data = transactions.data.map((transaction) => {
      return {
        id: transaction.id,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        remitter: {
          id: transaction.remitterId,
          name: transaction.remitterName,
          bankName: transaction?.remitterBank?.name,
        },
        beneficiary: {
          id: transaction.beneficiaryId,
          name: transaction.beneficiaryName,
          bankName: transaction?.beneficiaryBank?.name,
        },
        type: transaction.type,
        status: transaction.status,
        amount: transaction.amount,
        transactionFee: transaction.transactionFee,
        remitterPaidFee: transaction.remitterPaidFee,
        completedAt: transaction.completedAt,
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
