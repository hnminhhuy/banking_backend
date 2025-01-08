import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from '../../../../../decorators';
import { UserRole } from '../../../../user/core/enums/user_role';
import { ListTransactionDto } from '../../dtos';
import {
  TransactionByUserHistoryPageModel,
  TransactionHistoryPageModel,
} from 'src/modules/transactions/core/models/transacation_history_page.model';

export const TransactionRouteByEmployee = {
  listTransactionByCustomer: <IRouteParams>{
    path: 'customers/:userId',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Employee],
    swaggerParams: {
      query: ListTransactionDto,
      responses: [
        { status: HttpStatus.OK, type: TransactionByUserHistoryPageModel },
      ],
    },
  },
  listTransaction: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Employee],
    swaggerParams: {
      query: ListTransactionDto,
      responses: [{ status: HttpStatus.OK, type: TransactionHistoryPageModel }],
    },
  },
};
