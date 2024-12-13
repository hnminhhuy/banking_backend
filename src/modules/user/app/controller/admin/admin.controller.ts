import { Body, Controller, Query, Req } from '@nestjs/common';
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
      (query.sort as UserSort) ?? UserSort.CREATED_AT,
      query.direction,
    );

    console.log(pageParams);
    console.log(sortParams);

    const users = await this.listUsersUsecase.execute(
      query.role,
      pageParams,
      sortParams,
    );
    const data = users.data.map(
      ({ password, isBlocked, createdBy, ...userData }) => userData,
    );

    return {
      data: data,
      page: users.page,
      totalCount: users.totalCount,
    };
  }

  @Route(adminRoute.createEmployee)
  async createEmployee(@Req() req, @Body() body: CreateUserDto) {
    const params: UserModelParams = {
      ...body,
      role: UserRole.Employee,
      createdBy: req.user.authId,
      isBlocked: false,
    };

    const createdUser = await this.createUserUsecase.execute(params);
    const { password, ...returnData } = createdUser;
    return returnData;
  }
}
