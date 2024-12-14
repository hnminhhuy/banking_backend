import { Body, Controller, Req } from '@nestjs/common';
import { Route } from 'src/decorators';
import employeeRoute from '../../routes/employee/employee.route';
import { CreateUserDto } from '../../dtos';
import { UserModelParams } from 'src/modules/user/core/models/user.model';
import { CreateUserUsecase } from 'src/modules/user/core/usecases';
import { UserRole } from 'src/modules/user/core/enums/user_role';

@Controller({ path: 'api/employee/v1/users' })
export class UserControllerByEmployee {
  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  @Route(employeeRoute.createCustomer)
  async createCustomer(@Req() req, @Body() body: CreateUserDto) {
    const params: UserModelParams = {
      ...body,
      role: UserRole.Customer,
      createdBy: req.user.authId,
      isBlocked: false,
    };

    const createdUser = await this.createUserUsecase.execute(params);

    const { password, ...returnData } = createdUser;
    return returnData;
  }
}
