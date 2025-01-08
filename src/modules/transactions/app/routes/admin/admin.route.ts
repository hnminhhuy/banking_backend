import { HttpStatus, RequestMethod } from '@nestjs/common';
import { UserRole } from '../../../../user/core/enums/user_role';
import { ReconcileTransactionDto, StatisticTransactionDto } from '../../dtos';
import { IRouteParams } from '../../../../../decorators';
import { ReconcileModel } from 'src/modules/transactions/core/models/reconcile.model';
import { TransactionStatisticModel } from 'src/modules/transactions/core/models/transaction_statistic.model';

export const TransactionRouteByAdmin = {
  reconcileTransaction: <IRouteParams>{
    path: '/reconcile',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      query: ReconcileTransactionDto,
      responses: [{ status: HttpStatus.OK, type: ReconcileModel }],
    },
  },
  statisticTransaction: <IRouteParams>{
    path: '/statistic/:bankId',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      param: StatisticTransactionDto,
      responses: [{ status: HttpStatus.OK, type: TransactionStatisticModel }],
    },
  },
};
