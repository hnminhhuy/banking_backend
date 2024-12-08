import { HttpStatus, RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { CreateUserDto } from '../dtos';
import { UserModel } from '../../core/models/user.model';

export default {
  createUser: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: false,
    swaggerParams: {
      body: {
        required: true,
        type: CreateUserDto,
        description: 'Create a new user',
      },
      responses: [
        {
          status: HttpStatus.CREATED,
          description: 'User created successfully',
          type: UserModel,
        },
        { status: 400, description: 'Bad request.' },
      ],
    },
  },
};
