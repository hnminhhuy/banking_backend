import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import {
  CancelDebtResponseModel,
  DebtModel,
} from '../../core/models/debt.model';
import { BaseException } from 'src/exceptions';
import { DebtorNameModel } from '../../core/models/debtor_name.model';
import { CreateDebtReponseModel } from '../../core/models/create_debt_response.model';
import { DebtPageResponseModel } from '../../core/models/debt_page_response.model';
import {
  TransactionModel,
  DebtTransactionResponseModel,
} from 'src/modules/transactions/core/models/transaction.model';

export const DebtRoute = {
  createDebt: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    swaggerParams: {
      responses: [
        {
          status: HttpStatus.CREATED,
          type: CreateDebtReponseModel,
          description: 'Debt successfully created',
        },
        {
          status: HttpStatus.BAD_REQUEST,
          type: BaseException,
          description: 'Validation failed',
        },
        {
          status: HttpStatus.NOT_FOUND,
          type: BaseException,
          description: 'Reminder or debtor account not found',
        },
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          type: BaseException,
          description:
            'Unexpected server error or attempting to create debt for oneself',
        },
        {
          status: HttpStatus.UNAUTHORIZED,
          type: BaseException,
          description: 'Authentication required',
        },
        {
          status: HttpStatus.FORBIDDEN,
          type: BaseException,
          description: 'Access denied',
        },
      ],
    },
  },
  getDebt: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: true,
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: DebtModel },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
        {
          status: HttpStatus.NOT_FOUND,
          description: 'Debt not found',
          type: BaseException,
        },
      ],
    },
  },
  settleDebt: <IRouteParams>{
    path: '/:id/settle',
    method: RequestMethod.POST,
    secure: true,
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: DebtTransactionResponseModel },
      ],
    },
  },
  listDebt: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: DebtPageResponseModel },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
        {
          status: HttpStatus.NOT_FOUND,
          description: 'Debt not found',
          type: BaseException,
        },
      ],
    },
  },
  cancelDebt: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.PATCH,
    secure: true,
    swaggerParams: {
      responses: [
        {
          status: HttpStatus.OK,
          description: 'Debt successfully canceled',
          type: CancelDebtResponseModel,
        },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
        {
          status: HttpStatus.NOT_FOUND,
          description: 'Debt or account not found',
          type: BaseException,
        },
        {
          status: HttpStatus.CONFLICT,
          description: 'Debt cannot be canceled or already canceled',
          type: BaseException,
        },
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          description: 'Failed to cancel debt',
          type: BaseException,
        },
      ],
    },
  },
  getAllDebtors: <IRouteParams>{
    path: '/list/debtors',
    method: RequestMethod.GET,
    secure: true,
    swaggerParams: {
      responses: [
        {
          status: HttpStatus.OK,
          description: 'List of debtors successfully retrieved',
          type: [DebtorNameModel], // Assuming DebtorNameModel is the model for the debtor info
        },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
        {
          status: HttpStatus.NOT_FOUND,
          description: 'No debtors found for the reminder',
          type: BaseException,
        },
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          description: 'Unexpected server error',
          type: BaseException,
        },
        {
          status: HttpStatus.UNAUTHORIZED,
          type: BaseException,
          description: 'Authentication required',
        },
        {
          status: HttpStatus.FORBIDDEN,
          type: BaseException,
          description: 'Access denied',
        },
      ],
    },
  },
};
