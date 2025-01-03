import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from '../../../../../decorators';
import { TransactionModel } from '../../../core/models/transaction.model';
import { UserRole } from '../../../../user/core/enums/user_role';
import { GetTransactionDto } from '../../dtos/get_transaction.dto';
import { ListTransactionDto } from '../../dtos';

export const TransactionRouteByEmployee = {
  getTransaction: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Employee],
    swaggerParams: {
      params: GetTransactionDto,
      responses: [{ status: HttpStatus.OK, type: TransactionModel }],
    },
  },
  listTransactionByCustomer: <IRouteParams>{
    path: 'customers/:userId',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Employee],
    swaggerParams: {
      query: ListTransactionDto,
    },
  },
  listTransaction: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Employee],
    swaggerParams: {
      query: ListTransactionDto,
    },
  },
};
