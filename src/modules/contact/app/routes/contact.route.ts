import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { BaseException } from 'src/exceptions';
import { ContactModel } from '../../core/models/contact.model';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import { ContactUserModel } from '../../core/models/contact_user.model';

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
  getContact: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    secure: true,
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: ContactModel },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
        {
          status: HttpStatus.NOT_FOUND,
          description: 'Contact not found',
          type: BaseException,
        },
      ],
    },
  },

  getAllContact: <IRouteParams>{
    path: '/contact/all',
    method: RequestMethod.GET,
    secure: true,
    swaggerParams: {
      responses: [
        { status: HttpStatus.OK, type: ContactUserModel },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
          type: BaseException,
        },
        {
          status: HttpStatus.NOT_FOUND,
          description: 'Contact not found',
          type: BaseException,
        },
      ],
    },
  },

  listContact: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [
        { status: HttpStatus.CREATED, type: ContactModel },
        { status: HttpStatus.BAD_REQUEST, type: BaseException },
      ],
    },
  },
  updateContact: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.PATCH,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [
        {
          status: HttpStatus.OK,
          description: 'Contact updated successfully',
        },
        {
          status: HttpStatus.BAD_REQUEST,
          description: 'Invalid input data or no valid fields to update',
          type: BaseException,
        },
        {
          status: HttpStatus.NOT_FOUND,
          description: 'Contact or bank account not found',
          type: BaseException,
        },
        {
          status: HttpStatus.FORBIDDEN,
          description: 'Unauthorized to update this contact',
          type: BaseException,
        },
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          description: 'An unexpected error occurred',
          type: BaseException,
        },
      ],
    },
  },
  deleteContact: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.DELETE,
    secure: true,
    roles: [UserRole.Customer],
    swaggerParams: {
      responses: [
        {
          status: HttpStatus.OK,
          description: 'Contact deleted successfully',
        },

        {
          status: HttpStatus.NOT_FOUND,
          description: 'Contact not found',
          type: BaseException,
        },
        {
          status: HttpStatus.FORBIDDEN,
          description: 'Unauthorized to delete this contact',
          type: BaseException,
        },
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          description: 'An unexpected error occurred',
          type: BaseException,
        },
      ],
    },
  },
};
