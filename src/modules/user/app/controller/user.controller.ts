import { Body, Controller, HttpStatus } from '@nestjs/common';
import { CreateUserUsecase } from '../../core/usecases/users/create_user.usecase';
import { Route, SwaggerController } from 'src/decorators';
import { CreateUserDto } from '../dtos';
import { BaseException } from 'src/exceptions';
import { ERROR_CODES } from 'src/common/utils/constants';
import { UserModelParams } from '../../core/models/user.model';
import userRoute from './user.route';

@SwaggerController('users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  @Route(userRoute.createUser)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.createUserUsecase.execute(
        createUserDto as UserModelParams,
      );
      return createdUser;
    } catch (error) {
      console.error(error);
      throw new BaseException({
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Error while creating user.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
