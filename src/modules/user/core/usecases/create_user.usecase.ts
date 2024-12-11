import { Injectable } from '@nestjs/common';
import { IUserRepo } from '../repositories/user.irepo';
import { UserModel, UserModelParams } from '../models/user.model';

@Injectable()
export class CreateUserUsecase {
  constructor(private readonly userRepo: IUserRepo) {}

  public async execute(params: UserModelParams): Promise<UserModel> {
    type CreateUserParams = Pick<
      UserModelParams,
      'email' | 'username' | 'fullName' | 'role' | 'created_by' | 'isActive'
    >;

    params['isActive'] = true;

    const newUser = new UserModel(params as CreateUserParams);
    await this.userRepo.create(newUser);
    return newUser;
  }
}
