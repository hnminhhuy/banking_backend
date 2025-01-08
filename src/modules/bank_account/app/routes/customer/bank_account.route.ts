import { RequestMethod, HttpStatus } from '@nestjs/common';
import { IRouteParams } from '../../../../../decorators';
import { BankAccountModel } from '../../../core/models/bank_account.model';
import { GetBankAccountDto } from '../../dtos';
import { UserRole } from '../../../../user/core/enums/user_role';
import { BankAccountUserModel } from 'src/modules/bank_account/core/models/bank_account_user.model';

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
          type: BankAccountUserModel,
        },
      ],
    },
  },
  depositToAccount: <IRouteParams>{
    path: '/deposit',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Employee],
    swaggerParams: {},
  },
};
