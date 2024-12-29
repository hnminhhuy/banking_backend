import { RequestMethod, HttpStatus } from '@nestjs/common';
import { IRouteParams } from '../../../../../decorators';
import { BankAccountModel } from '../../../core/models/bank_account.model';
import { GetBankAccountDto } from '../../dtos';
import { UserRole } from '../../../../user/core/enums/user_role';

export const BankAccountRouteByCustomer = {
  getBankAccount: <IRouteParams>{
    path: '/get-one',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      body: GetBankAccountDto,
      responses: [
        {
          status: HttpStatus.OK,
          type: BankAccountModel,
        },
      ],
    },
  },
  depositToAccount: <IRouteParams>{
    path: '/deposit',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {},
  },
};
