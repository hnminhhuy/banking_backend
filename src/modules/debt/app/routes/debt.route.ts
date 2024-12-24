import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { DebtModel } from '../../core/models/debt.model';
import { BaseException } from 'src/exceptions';

export const DebtRoute = {
  createDebt: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    swaggerParams: {
      responses: [
        {
          status: HttpStatus.CREATED,
          type: DebtModel,
        },
        {
          status: HttpStatus.BAD_REQUEST,
          type: BaseException,
        },
        {
          status: HttpStatus.NOT_FOUND,
          type: BaseException,
        },
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          type: BaseException,
        },
        {
          status: HttpStatus.UNAUTHORIZED,
          type: BaseException,
        },
        {
          status: HttpStatus.FORBIDDEN,
          type: BaseException,
        },
      ],
    },
  },
};
