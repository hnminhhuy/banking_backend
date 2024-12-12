import { RequestMethod, HttpStatus } from '@nestjs/common';
import { IRouteParams } from '../../../../../decorators';
import { BankAccountModel } from '../../../core/models/bank_account.model';
import { GetBankAccountDto } from '../../dtos';

export const bankAccountRoute = {
  getBank: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: false,
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
