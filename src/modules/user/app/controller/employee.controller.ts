import { Body, Controller, HttpStatus, Query, Req } from '@nestjs/common';
import { Route } from 'src/decorators';
import employeeRoute from '../routes/employee.route';
import { CreateUserDto, ListUserDto } from '../dtos';
import { UserModelParams } from 'src/modules/user/core/models/user.model';
import {
  CreateUserUsecase,
  GeneratePasswordUsecase,
  GetUserUsecase,
  ListUserUsecase,
} from 'src/modules/user/core/usecases';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import { PageParams, SortParams } from 'src/common/models';
import { UserSort } from 'src/modules/user/core/enums/user_sort';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User By Employee')
@Controller({ path: 'api/employee/v1/users' })
export class UserControllerByEmployee {
  constructor(
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly listCustomersUsecase: ListUserUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly generatePasswordUsecase: GeneratePasswordUsecase,
  ) {}

  @Route(employeeRoute.createCustomer)
  async createCustomer(@Req() req, @Body() body: CreateUserDto) {
    const rawPassword = this.generatePasswordUsecase.execute(10);

    const params: UserModelParams = {
      ...body,
      password: rawPassword,
      role: UserRole.Customer,
      createdBy: req.user.authId,
      isBlocked: false,
    };

    const createdUser = await this.createUserUsecase.execute(params);
    const { password, ...returnData } = createdUser;
    returnData['rawPassword'] = rawPassword;

    return {
      data: returnData,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Route(employeeRoute.listCustomer)
  async listCustomers(@Query() query: ListUserDto) {
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

    const pageResult = await this.listCustomersUsecase.execute(
      query.role,
      pageParams,
      sortParams,
    );

    const data = pageResult.data.map(
      ({ password, isBlocked, createdBy, ...returnedData }) => returnedData,
    );

    return {
      data: data,
      metadata: {
        page: pageResult.page,
        totalCount: pageResult.totalCount,
      },
    };
  }

  @Route(employeeRoute.getMe)
  async getMe(@Req() req) {
    return await this.getUserUsecase.execute('id', req.user.authId);
  }
}
