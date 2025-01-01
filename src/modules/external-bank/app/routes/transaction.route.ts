import { RequestMethod, HttpStatus } from '@nestjs/common';
import { IRouteParams } from '../../../../decorators';
import { ExternalTransactionData } from '../../../transactions/app/dtos';
import { TransactionModel } from '../../../transactions/core/models/transaction.model';

export const TransactionRouteByExternalBank = {
  createTransaction: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    swaggerParams: {
      body: ExternalTransactionData,
      responses: [{ status: HttpStatus.CREATED, type: TransactionModel }],
    },
  },
};
