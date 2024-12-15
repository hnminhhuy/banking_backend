import { Body, Controller, Req } from '@nestjs/common';
import { Route } from 'src/decorators';
import employeeRoute from '../../routes/employee/employee.route';
import { CreateCustomerDto, CreateUserDto } from '../../dtos';
import { UserModelParams } from 'src/modules/user/core/models/user.model';
import { CreateUserUsecase } from 'src/modules/user/core/usecases';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import { CreateBankAccountUsecase } from '../../../../bank_account/core/usecases';
import { GetBankUsecase } from '../../../../bank/core/usecases';
import { BankAccountParams } from '../../../../bank_account/core/models/bank_account.model';

@Controller({ path: 'api/employee/v1/users' })
export class UserControllerByEmployee {
  constructor(
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly createBankAccountUsecase: CreateBankAccountUsecase,
    private readonly getBankUsecase: GetBankUsecase,
  ) {}

  @Route(employeeRoute.createCustomer)
  async createCustomer(@Req() req, @Body() body: CreateCustomerDto) {
    const userParams: UserModelParams = {
      ...body,
      role: UserRole.Customer,
      createdBy: req.user.authId,
      isBlocked: false,
    };

    const bank = await this.getBankUsecase.execute('code', 'NHB');
    const createdUser = await this.createUserUsecase.execute(userParams);

    const bankParams: BankAccountParams = {
      id: undefined,
      bankId: bank.id,
      userId: createdUser.id,
      balance: body.balance,
    };

    await this.createBankAccountUsecase.execute(bankParams);
    const { password, ...returnData } = createdUser;
    return returnData;
  }
}
