import { Injectable } from '@nestjs/common';
import { IUserRepo } from 'src/modules/user/core/repositories/user.irepo';
import { UserDatasource } from '../user.datasource';
import {
  UserModel,
  UserModelParams,
} from 'src/modules/user/core/models/user.model';
import { PageParams, SortParams, Page } from 'src/common/models';
import { UserSort } from 'src/modules/user/core/enums/user_sort';
import { UserRole } from 'src/modules/user/core/enums/user_role';

@Injectable()
export class UserRepo implements IUserRepo {
  constructor(private readonly userDatasource: UserDatasource) {}
  public async create(user: UserModel): Promise<void> {
    await this.userDatasource.create(user);
  }

  public getUserBy(
    key: string,
    value: unknown,
    relations: string[] | undefined = undefined,
  ): Promise<UserModel | undefined> {
    return this.userDatasource.getUserBy(key, value, relations);
  }
  public async updatePassword(id: string, password: string): Promise<boolean> {
    return await this.userDatasource.updatePassword(id, password);
  }
  public async update(
    id: string,
    updatedFields: Partial<UserModelParams>,
  ): Promise<boolean> {
    return await this.userDatasource.update(id, updatedFields);
  }

  public async list(
    role: UserRole,
    pageParams: PageParams,
    sortParams: SortParams<UserSort>,
    relations: string[] | undefined,
  ): Promise<Page<UserModel>> {
    return await this.userDatasource.list(
      role,
      pageParams,
      sortParams,
      relations,
    );
  }

  public async updateBlocked(id: string, isBlocked: boolean): Promise<boolean> {
    return this.userDatasource.updateBlocked(id, isBlocked);
  }

  public getBlockedUser(): Promise<string[]> {
    return this.userDatasource.getBlockedUser();
  }
}
