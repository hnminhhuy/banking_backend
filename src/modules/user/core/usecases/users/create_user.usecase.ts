import { Injectable } from '@nestjs/common';
import { IUserRepo } from '../../repositories/user.irepo';
import { UserModel, UserModelParams } from '../../models/user.model';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class CreateUserUsecase {
  constructor(private readonly userRepo: IUserRepo) {}

  @Transactional()
  public async execute(params: UserModelParams) {
    type CreateUserParams = Pick<
      UserModelParams,
      'email' | 'userName' | 'studentId' | 'additionalEmail'
    >;

    const newUser = new UserModel(params as CreateUserParams);
    await this.userRepo.create(newUser);
    return newUser;
  }
}
