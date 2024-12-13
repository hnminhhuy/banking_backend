import { HttpStatus, Injectable } from '@nestjs/common';
import { IUserRepo } from '../repositories/user.irepo';
import { UserModel, UserModelParams } from '../models/user.model';
import { BaseException } from 'src/exceptions';
import { ERROR_CODES } from 'src/common/utils/constants';

@Injectable()
export class CreateUserUsecase {
  constructor(private readonly userRepo: IUserRepo) {}

  public async execute(params: UserModelParams): Promise<UserModel> {
    type CreateUserParams = Pick<
      UserModelParams,
      'email' | 'username' | 'fullName' | 'role' | 'createdBy' | 'isBlocked'
    >;

    params['isBlocked'] = false;
    params['password'] = await UserModel.hashPassword(params['password']);

    const existingUser =
      (await this.userRepo.getUserBy(
        'username',
        params['username'],
        undefined,
      )) ||
      (await this.userRepo.getUserBy('email', params['email'], undefined));

    if (existingUser) {
      throw new BaseException({
        code: ERROR_CODES.USER_ALREADY_EXIST,
        message: `User with username or email ${params['username']} or ${params['email']} already exists`,
        status: HttpStatus.CONFLICT,
      });
    }

    const newUser = new UserModel(params as CreateUserParams);
    await this.userRepo.create(newUser);
    return newUser;
  }
}
