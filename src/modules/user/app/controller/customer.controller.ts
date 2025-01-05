import { Controller, Req } from '@nestjs/common';
import { GetUserUsecase } from '../../core/usecases';
import { Route } from 'src/decorators';
import customerRoute from '../routes/customer.route';
import { GetCustomerDashBoardInfoUsecase } from '../../core/usecases/get_customer_dashboard_info.usecase';

@Controller({ path: 'api/customer/v1' })
export class UserControllerByCustomer {
  constructor(
    private readonly getUserUsecase: GetUserUsecase,
    private readonly getCustomerDashboardInfoUsecase: GetCustomerDashBoardInfoUsecase,
  ) {}

  @Route(customerRoute.getMe)
  async getUser(@Req() req) {
    return await this.getUserUsecase.execute('id', req.user.authId, [
      'bankAccount',
    ]);
  }

  @Route(customerRoute.getDashboardInfo)
  async getDashboardInfo(@Req() req) {
    return await this.getCustomerDashboardInfoUsecase.execute(req.user.authId);
  }
}
