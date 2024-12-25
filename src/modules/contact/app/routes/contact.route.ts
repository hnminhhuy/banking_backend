import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { BaseException } from 'src/exceptions';
import { ContactModel } from '../../core/models/contact.model';

export const ContactRoute = {
  createContact: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    swaggerParams: {
      responses: [
        {
          status: HttpStatus.CREATED,
          type: ContactModel,
          description: 'Successfully created contact',
        },
        {
          status: HttpStatus.BAD_REQUEST,
          type: BaseException,
          description: 'Bad Request (Invalid input data)',
        },
        {
          status: HttpStatus.FORBIDDEN,
          description: 'Cannot create contact for external bank',
        },
        {
          status: HttpStatus.CONFLICT,
          description: 'Cannot create contact for yourself',
        },
        {
          status: HttpStatus.NOT_FOUND,
          type: BaseException,
          description: 'User or Bank Account not found',
        },
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          description: 'An unexpected error occurred',
        },
      ],
    },
  },
};
