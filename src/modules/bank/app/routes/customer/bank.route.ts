import { RequestMethod, HttpStatus } from '@nestjs/common';
import { IRouteParams } from '../../../../../decorators';
import { UserModel } from '../../../../user/core/models/user.model';
import { Page } from '../../../../../common/models';
import { BankModel } from '../../../core/models/bank.model';
import { ListBankDto } from '../../dto/list_banks.dto';
import { GetBankDto } from '../../dto';

export default {
  listBank: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: false,
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
  getBank: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: false,
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
