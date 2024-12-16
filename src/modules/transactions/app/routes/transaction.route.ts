import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from '../../../../decorators';
import { TransactionModel } from '../../core/models/transaction.model';
import { UserRole } from '../../../user/core/enums/user_role';

export const TransactionRoute = {
  createTransaction: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [{ status: HttpStatus.CREATED, type: TransactionModel }],
    },
  },
  getTransaction: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [{ status: HttpStatus.OK, type: TransactionModel }],
    },
  },
};
