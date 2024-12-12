import { Controller, Query } from '@nestjs/common';
import { Route } from 'src/decorators';
import adminRoute from '../../routes/admin/admin.route';
import { ListUserDto } from '../../dtos/list_user.dto';
import { PageParams, SortParams } from 'src/common/models';
import { UserSort } from 'src/modules/user/core/enums/user_sort';
import { ListUserUsecase } from 'src/modules/user/core/usecases';

@Controller({ path: 'api/admin/v1/users' })
export class UserControllerByAdmin {
  constructor(private readonly listUsersUsecase: ListUserUsecase) {}

  @Route(adminRoute.listUsers)
  async list(@Query() query: ListUserDto) {
    const pageParams = new PageParams(
      query.page,
      query.limit,
      query.needTotalCount,
      query.onlyCount,
    );

    const sortParams: SortParams<UserSort> = new SortParams(
      query.sort as UserSort,
      query.direction,
    );

    const users = await this.listUsersUsecase.execute(pageParams, sortParams);
    return users.data.map((user) => {
      const { password, isBlocked, createdBy, ...userData } = user;
      return userData;
    });
  }

  @Route(adminRoute.createEmployee)
  async createEmployee() {}
}
