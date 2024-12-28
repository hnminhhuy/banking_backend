import { Body, Controller, HttpStatus, Query, Req } from '@nestjs/common';
import { Route } from 'src/decorators';
import employeeRoute from '../routes/employee.route';
import { CreateCustomerDto, ListUserDto } from '../dtos';
import { UserModelParams } from 'src/modules/user/core/models/user.model';
import {
  CreateUserUsecase,
  GeneratePasswordUsecase,
  GetUserUsecase,
  ListUserUsecase,
} from 'src/modules/user/core/usecases';
import { UserSort } from 'src/modules/user/core/enums/user_sort';
import { ApiTags } from '@nestjs/swagger';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { CreateBankAccountUsecase } from '../../../bank_account/core/usecases';
import { SendMailUseCase } from '../../../mail/core/usecases/send_mail.usecase';
import { BankAccountParams } from '../../../bank_account/core/models/bank_account.model';
import { PageParams, SortParams } from '../../../../common/models';
import { UserRole } from '../../core/enums/user_role';
import { mailList } from '../../../mail/core/models/mail_list';
import { Transactional } from 'typeorm-transactional';
import { BankCode } from '../../../bank/core/enums/bank_code';

@ApiTags('User By Employee')
@Controller({ path: 'api/employee/v1/users' })
export class UserControllerByEmployee {
  constructor(
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly listCustomersUsecase: ListUserUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly generatePasswordUsecase: GeneratePasswordUsecase,
    private readonly getBankUsecase: GetBankUsecase,
    private readonly createBankAccountUsecase: CreateBankAccountUsecase,
    private readonly sendMailUsecase: SendMailUseCase,
    private readonly bankCode: BankCode,
  ) {}

  @Route(employeeRoute.createCustomer)
  @Transactional()
  async createCustomer(@Req() req, @Body() body: CreateCustomerDto) {
    const rawPassword = this.generatePasswordUsecase.execute(10);

    const userParams: UserModelParams = {
      ...body,
      password: rawPassword,
      role: UserRole.Customer,
      createdBy: req.user.authId,
      isBlocked: false,
    };

    const createdUser = await this.createUserUsecase.execute(userParams);
    const { password, ...returnData } = createdUser;
    returnData['rawPassword'] = rawPassword;

    const bank = await this.getBankUsecase.execute(
      'code',
      this.bankCode.DEFAULT,
    );

    const bankAccountParams: BankAccountParams = {
      bankId: bank.id,
      userId: createdUser.id,
      balance: body.balance ?? 0,
    };

    await this.createBankAccountUsecase.execute(bankAccountParams);

    await this.sendMailUsecase.execute(
      createdUser.email,
      mailList.getInitPassword,
      {
        fullName: createdUser.fullName,
        initialPassword: rawPassword,
      },
    );

    return {
      data: returnData,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Route(employeeRoute.listCustomer)
  async listCustomers(@Query() query: ListUserDto) {
    const pageParams = new PageParams(
      query.page,
      query.limit,
      query.needTotalCount,
      query.onlyCount,
    );

    const sortParams: SortParams<UserSort> = new SortParams(
      (query.sort as UserSort) ?? UserSort.CREATED_AT,
      query.direction,
    );

    const pageResult = await this.listCustomersUsecase.execute(
      query.role,
      pageParams,
      sortParams,
      ['bankAccount'],
    );

    const data = pageResult.data.map(
      ({ password, isBlocked, createdBy, ...returnedData }) => returnedData,
    );

    return {
      data: data,
      metadata: {
        page: pageResult.page,
        totalCount: pageResult.totalCount,
      },
    };
  }

  @Route(employeeRoute.getMe)
  async getMe(@Req() req) {
    return await this.getUserUsecase.execute('id', req.user.authId);
  }
}
