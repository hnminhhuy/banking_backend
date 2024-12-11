import { Body, Controller, HttpStatus, RequestMethod } from '@nestjs/common';
import { ERROR_CODES } from 'src/common/utils/constants';
import { Route } from 'src/decorators';
import { BaseException } from 'src/exceptions';
import { UserModelParams } from 'src/modules/user/core/models/user.model';
import { CreateUserUsecase } from 'src/modules/user/core/usecases/create_user.usecase';

@Controller('/')
export class AppController {
  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  @Route({ path: '/', method: RequestMethod.GET })
  getHealth(): string {
    return 'OK!';
  }

  @Route({
    path: '/api/dump',
    method: RequestMethod.POST,
  })
  async dumpData(
    @Body()
    body: {
      email: string;
      userName: string;
      password: string;
      fullname: string;
      role: string;
      created_by: string | undefined;
    },
  ) {
    try {
      const newUser = await this.createUserUsecase.execute(
        body as unknown as UserModelParams,
      );

      return newUser;
    } catch (error) {
      throw new BaseException({
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong!',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
