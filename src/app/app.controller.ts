import { Controller, RequestMethod } from '@nestjs/common';

import { Route } from 'src/decorators';

@Controller('/')
export class AppController {
  constructor() {}

  @Route({ path: '/', method: RequestMethod.GET })
  async getHealth(): Promise<string> {
    return 'OK!';
  }
}
