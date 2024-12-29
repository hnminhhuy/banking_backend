import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from '../../../../../decorators';
import { TransactionModel } from '../../../core/models/transaction.model';
import { UserRole } from '../../../../user/core/enums/user_role';
import { CreateTransactionDto, ListTransactionDto } from '../../dtos';
import { GetTransactionDto } from '../../dtos/get_transaction.dto';

export const TransactionRouteByCustomer = {
  createTransaction: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      body: CreateTransactionDto,
      responses: [{ status: HttpStatus.CREATED, type: TransactionModel }],
    },
  },
  getTransaction: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      params: GetTransactionDto,
      responses: [{ status: HttpStatus.OK, type: TransactionModel }],
    },
  },
  listTransaction: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      query: ListTransactionDto,
    },
  },
  verifyOtp: <IRouteParams>{
    path: '/verify-otp',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Customer],
  },
};
