import { Injectable } from '@nestjs/common';
import { IUserRepo } from 'src/modules/user/core/repositories/user.irepo';
import { UserDatasource } from '../user.datasource';
import { UserModel } from 'src/modules/user/core/models/user.model';

@Injectable()
export class UserRepo implements IUserRepo {
  constructor(private readonly userDatasource: UserDatasource) {}
  public getUserBy(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<UserModel | undefined> {
    return this.userDatasource.getUserBy(key, value, relations);
  }

  public async create(user: UserModel): Promise<void> {
    await this.userDatasource.create(user);
  }
}
