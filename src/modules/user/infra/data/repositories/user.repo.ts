import { UserModel } from 'src/modules/user/core/models/user.model';
import { IUserRepo } from 'src/modules/user/core/repositories/user.irepo';
import { UserDataSource } from '../user.datasource';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepo implements IUserRepo {
  constructor(private readonly userDataSource: UserDataSource) {}

  public async create(user: UserModel): Promise<void> {
    await this.userDataSource.create(user);
  }
}
