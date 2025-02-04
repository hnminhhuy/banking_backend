import { RequestMethod, HttpStatus } from '@nestjs/common';
import { IRouteParams } from '../../../../../decorators';
import { Page } from '../../../../../common/models';
import { BankModel } from '../../../core/models/bank.model';
import { ListBankDto } from '../../dto/list_banks.dto';
import { GetBankDto } from '../../dto';
import { UserRole } from '../../../../user/core/enums/user_role';
import { CustomerBankPageResponseModel } from 'src/modules/user/core/models/customer_bank_page_response.model';

export default {
  listBank: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      query: ListBankDto,
      responses: [
        {
          status: HttpStatus.OK,
          type: CustomerBankPageResponseModel,
        },
        { status: 400, description: 'Bad request.' },
      ],
    },
  },
  getBank: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      param: GetBankDto,
      responses: [
        {
          status: HttpStatus.OK,
          type: BankModel,
        },
      ],
    },
  },
};
