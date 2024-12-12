import { Injectable } from '@nestjs/common';
import { IUserRepo } from '../repositories/user.irepo';
import { PageParams, SortParams } from 'src/common/models';
import { UserSort } from '../enums/user_sort';

@Injectable()
export class ListUserUsecase {
  constructor(private readonly userRepo: IUserRepo) {}

  public async execute(
    pageParams: PageParams,
    sortParams: SortParams<UserSort>,
    relations: string[] | undefined = undefined,
  ) {
    return await this.userRepo.list(pageParams, sortParams, relations);
  }
}
