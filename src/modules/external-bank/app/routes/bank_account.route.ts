import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from '../../../../decorators';
import { GetBankAccountDto } from '../../../bank_account/app/dtos';
import { BankAccountModel } from '../../../bank_account/core/models/bank_account.model';

export const BankAccountRouteByExternalBank = {
  getBankAccount: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: true,
    swaggerParams: {
      param: GetBankAccountDto,
      responses: [
        {
          status: HttpStatus.OK,
          type: BankAccountModel,
        },
      ],
    },
  },
};
