import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { IUserRepo } from '../repositories/user.irepo';

@Injectable()
export class GetUserUsecase {
  constructor(private readonly userRepo: IUserRepo) {}

  public async execute(
    key: string,
    value: unknown,
    relations: string[] | undefined = undefined,
  ): Promise<UserModel | undefined> {
    return this.userRepo.getUserBy(key, value, relations);
  }
}
