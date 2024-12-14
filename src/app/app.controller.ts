import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  ForbiddenException,
  Inject,
  Param,
  RequestMethod,
} from '@nestjs/common';
import { isDevelopmentEnv } from 'src/common/helpers/env.helper';
import { Route } from 'src/decorators';
import { UserModelParams } from 'src/modules/user/core/models/user.model';
import {
  CreateUserUsecase,
  UpdateUserUsecase,
} from 'src/modules/user/core/usecases';
import { Cache } from 'cache-manager';

@Controller('/')
export class AppController {
  constructor(
    private readonly updateUserUsecase: UpdateUserUsecase,
    private readonly createUserUsecase: CreateUserUsecase,
  ) {}

  @Route({ path: '/', method: RequestMethod.GET })
  async getHealth(): Promise<string> {
    return 'OK!';
  }

  @Route({
    path: '/api/dump',
    method: RequestMethod.POST,
  })
  async apiCreateDump(@Body() body: UserModelParams) {
    if (!isDevelopmentEnv) {
      throw new ForbiddenException();
    }
    return await this.createUserUsecase.execute(body);
  }

  @Route({ path: '/api/dump/:id', method: RequestMethod.PATCH })
  async apiUpdateDump(@Param('id') id: string, @Body() body: UserModelParams) {
    if (!isDevelopmentEnv) {
      throw new ForbiddenException();
    }

    return await this.updateUserUsecase.execute(id, body);
  }
}
