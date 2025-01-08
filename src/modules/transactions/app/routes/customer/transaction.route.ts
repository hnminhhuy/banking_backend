import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from '../../../../../decorators';
import {
  GetTransactionResponseModel,
  TransactionModel,
  TransactionResponseModel,
} from '../../../core/models/transaction.model';
import { UserRole } from '../../../../user/core/enums/user_role';
import { CreateTransactionDto, ListTransactionDto } from '../../dtos';
import {
  GetChartMode,
  GetTransactionDto,
} from '../../dtos/get_transaction.dto';
import { TransactionPageResponseModel } from 'src/modules/transactions/core/models/transaction_page_response.model';
import { BooleanModel } from 'src/modules/user/core/models/user.model';
import { ChartResponseModel } from 'src/modules/transactions/core/models/chart_response.model';

export const TransactionRouteByCustomer = {
  createTransaction: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      body: CreateTransactionDto,
      responses: [
        { status: HttpStatus.CREATED, type: TransactionResponseModel },
      ],
    },
  },
  getTransaction: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      params: GetTransactionDto,
      responses: [{ status: HttpStatus.OK, type: GetTransactionResponseModel }],
    },
  },
  listTransaction: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      query: ListTransactionDto,
      responses: [
        { status: HttpStatus.OK, type: TransactionPageResponseModel },
      ],
    },
  },
  verifyOtp: <IRouteParams>{
    path: '/verify-otp',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [{ status: HttpStatus.OK, type: BooleanModel }],
    },
  },
  getChartData: <IRouteParams>{
    path: '/chart/data',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      query: GetChartMode,
      responses: [{ status: HttpStatus.OK, type: ChartResponseModel }],
    },
  },
};
