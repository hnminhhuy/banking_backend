import { RequestMethod, HttpStatus } from '@nestjs/common';
import { IRouteParams } from '../../../../decorators';
import { CreateTransactionForAnotherBankDto } from '../../../transactions/app/dtos';
import { TransactionModel } from '../../../transactions/core/models/transaction.model';

export const TransactionRouteByAnotherBank = {
  createTransaction: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    swaggerParams: {
      body: CreateTransactionForAnotherBankDto,
      responses: [{ status: HttpStatus.CREATED, type: TransactionModel }],
    },
  },
};
