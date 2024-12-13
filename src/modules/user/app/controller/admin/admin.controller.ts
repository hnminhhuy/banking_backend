import { Body, Controller, Param, Query } from '@nestjs/common';
import { Route } from 'src/decorators';
import adminRoute from '../../routes/admin/admin.route';
import { PageParams, SortParams } from 'src/common/models';
import { UserSort } from 'src/modules/user/core/enums/user_sort';
import {
  CreateUserUsecase,
  ListUserUsecase,
} from 'src/modules/user/core/usecases';
import { CreateUserDto, ListUserDto } from '../../dtos';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import { UserModelParams } from 'src/modules/user/core/models/user.model';

@Controller({ path: 'api/admin/v1/users' })
export class UserControllerByAdmin {
  constructor(
    private readonly listUsersUsecase: ListUserUsecase,
    private readonly createUserUsecase: CreateUserUsecase,
  ) {}

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
  async createEmployee(@Body() body: CreateUserDto) {
    const params: UserModelParams = {
      ...body,
      role: UserRole.Employee,
      createdBy: 'admin_id',
      isBlocked: false,
    };

    return await this.createUserUsecase.execute(params);
  }
}
