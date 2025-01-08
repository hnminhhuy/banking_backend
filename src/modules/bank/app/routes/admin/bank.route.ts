import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import { ListBankDto } from '../../dto';
import { BankModel } from 'src/modules/bank/core/models/bank.model';
import { Page } from 'src/common/models';

export default {
  listBank: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Admin],
    swaggerParams: {
      query: ListBankDto,
      responses: [
        {
          status: HttpStatus.OK,
          type: Page<BankModel>,
        },
        { status: 400, description: 'Bad request.' },
      ],
    },
  },
};
