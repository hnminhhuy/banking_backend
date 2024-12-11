import { Controller, RequestMethod } from '@nestjs/common';
import { Route } from 'src/decorators';

@Controller('/')
export class AppController {
  @Route({ path: '/', method: RequestMethod.GET })
  getHealth(): string {
    return 'OK!';
  }
}
