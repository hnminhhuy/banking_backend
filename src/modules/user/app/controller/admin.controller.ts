import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { Route } from 'src/decorators';
import adminRoute from '../routes/admin.route';
import { PageParams, SortParams } from 'src/common/models';
import { UserSort } from 'src/modules/user/core/enums/user_sort';
import {
  BlockUserUsecase,
  CreateUserUsecase,
  GeneratePasswordUsecase,
  GetUserUsecase,
  ListUserUsecase,
  UnblockUserUsecase,
  UpdateUserUsecase,
} from 'src/modules/user/core/usecases';
import { CreateUserDto, ListUserDto } from '../dtos';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import { UserModelParams } from 'src/modules/user/core/models/user.model';
import { UpdateUserDto } from '../dtos/update_user.dto';
import { IdDto } from 'src/common/dtos';
import { ApiTags } from '@nestjs/swagger';
import { ERROR_CODES } from 'src/common/utils/constants';

@ApiTags('Users By Admin')
@Controller({ path: 'api/admin/v1/users' })
export class UserControllerByAdmin {
  constructor(
    private readonly listUsersUsecase: ListUserUsecase,
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly updateUserUsecase: UpdateUserUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly blockUserUsecase: BlockUserUsecase,
    private readonly generatePasswordUsecase: GeneratePasswordUsecase,
    private readonly unblockUserUsecase: UnblockUserUsecase,
  ) {}

  @Route(adminRoute.createEmployee)
  async createEmployee(@Req() req, @Body() body: CreateUserDto) {
    const rawPassword = this.generatePasswordUsecase.execute(10);

    const params: UserModelParams = {
      ...body,
      password: rawPassword,
      role: UserRole.Employee,
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

    const users = await this.listUsersUsecase.execute(
      query.role,
      pageParams,
      sortParams,
    );
    const data = users.data.map(
      ({ password, createdBy, ...userData }) => userData,
    );

    return {
      data: data,
      metadata: {
        page: users.page,
        totalCount: users.totalCount,
      },
    };
  }

  @Route(adminRoute.getMe)
  async getMe(@Req() req) {
    return await this.getUserUsecase.execute('id', req.user.authId);
  }

  // @Route(adminRoute.getUser)
  // async getUser(@Param() params: IdDto) {
  //   return await this.getUserUsecase.execute('id', params.id);
  // }

  // @Route(adminRoute.updateUser)
  // async updateUser(@Param() params: IdDto, @Body() body: UpdateUserDto) {
  //   return await this.updateUserUsecase.execute(params.id, body);
  // }

  @Route(adminRoute.blockedUser)
  async blockedUser(@Req() req, @Param() params: IdDto) {
    if (req.user.authId === params.id) {
      throw new BadRequestException({
        code: ERROR_CODES.BAD_REQUEST,
        message: 'You cannot block yourself.',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return await this.blockUserUsecase.execute(params.id);
  }

  @Route(adminRoute.unblockUser)
  async unblockUser(@Req() req, @Param() params: IdDto) {
    if (req.user.authId === params.id) {
      throw new BadRequestException({
        code: ERROR_CODES.BAD_REQUEST,
        message: 'You cannot unblock yourself.',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return await this.unblockUserUsecase.execute(params.id);
  }
}
