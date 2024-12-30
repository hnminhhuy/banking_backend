import { RequestMethod } from '@nestjs/common';
import { UserRole } from '../../../../user/core/enums/user_role';
import { ReconcileTransactionDto, StatisticTransactionDto } from '../../dtos';
import { IRouteParams } from '../../../../../decorators';

export const TransactionRouteByAdmin = {
  reconcileTransaction: <IRouteParams>{
    path: '/reconcile',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      query: ReconcileTransactionDto,
    },
  },
  statisticTransaction: <IRouteParams>{
    path: '/statistic/:bankId',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      param: StatisticTransactionDto,
    },
  },
};
