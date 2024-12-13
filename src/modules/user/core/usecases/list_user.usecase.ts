import { Injectable } from '@nestjs/common';
import { IUserRepo } from '../repositories/user.irepo';
import { PageParams, SortParams } from 'src/common/models';
import { UserSort } from '../enums/user_sort';
import { UserRole } from '../enums/user_role';

@Injectable()
export class ListUserUsecase {
  constructor(private readonly userRepo: IUserRepo) {}

  public async execute(
    role: UserRole,
    pageParams: PageParams,
    sortParams: SortParams<UserSort>,
    relations: string[] | undefined = undefined,
  ) {
    return await this.userRepo.list(role, pageParams, sortParams, relations);
  }
}
