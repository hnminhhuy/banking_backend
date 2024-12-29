import { RequestMethod, HttpStatus } from '@nestjs/common';
import { IRouteParams } from '../../../../../decorators';
import { BankAccountModel } from '../../../core/models/bank_account.model';
import { GetBankAccountDto } from '../../dtos';
import { ListBankAccountDto } from '../../dtos/list_bank_account.dto';
import { Page } from '../../../../../common/models';
import { UserRole } from '../../../../user/core/enums/user_role';

export const BankAccountRouteByEmployee = {
  getBankAccount: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Employee],
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
  listBank: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Employee],
    swaggerParams: {
      query: ListBankAccountDto,
      responses: [
        {
          status: HttpStatus.OK,
          type: Page<BankAccountModel>,
        },
        { status: 400, description: 'Bad request.' },
      ],
    },
  },
};
