import { Controller, Req } from '@nestjs/common';
import { GetUserUsecase } from '../../core/usecases';
import { Route } from 'src/decorators';
import customerRoute from '../routes/customer.route';

@Controller({ path: 'api/customer/v1' })
export class UserControllerByCustomer {
  constructor(private readonly getUserUsecase: GetUserUsecase) {}

  @Route(customerRoute.getMe)
  async getUser(@Req() req) {
    return await this.getUserUsecase.execute('id', req.user.authId, [
      'bankAccount',
    ]);
  }
}
