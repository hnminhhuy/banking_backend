import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  RequestMethod,
} from '@nestjs/common';
import { isDevelopmentEnv } from 'src/common/helpers/env.helper';
import { Route } from 'src/decorators';
import { GetConfigUsecase } from 'src/modules/bank_config/core/usecase';
import { UserModelParams } from 'src/modules/user/core/models/user.model';
import {
  CreateUserUsecase,
  UpdateUserUsecase,
} from 'src/modules/user/core/usecases';

@Controller('/')
export class AppController {
  constructor(
    private readonly updateUserUsecase: UpdateUserUsecase,
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly getConfigUsecase: GetConfigUsecase,
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
