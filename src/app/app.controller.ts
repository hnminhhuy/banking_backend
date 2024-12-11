import { Controller, RequestMethod } from '@nestjs/common';
import { Route } from 'src/decorators';
import { CreateUserUsecase } from 'src/modules/user/core/usecases/create_user.usecase';

@Controller('/')
export class AppController {
  @Route({ path: '/', method: RequestMethod.GET })
  getHealth(): string {
    return 'OK!';
  }
}
