import { BadRequestException, Body, Controller } from '@nestjs/common';
import {
  ChangeBalanceUsecase,
  GetBankAccountUsecase,
} from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import { DepositDto, GetBankAccountDto } from '../../dtos';
import { BankAccountRouteByCustomer } from '../../routes/customer/bank_account.route';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetAnotherBankAccountInfoUsecase } from '../../../../another-bank/core/usecases/bank_account/get_another_bank_user.usecase';

@Controller({ path: 'api/customer/v1/bank-accounts' })
@ApiBearerAuth()
export class BankAccountController {
  constructor(
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getAnotherBankAccountUsecase: GetAnotherBankAccountInfoUsecase,
    private readonly changeBalanceUsecase: ChangeBalanceUsecase,
  ) {}

  @Route(BankAccountRouteByCustomer.getBankAccount)
  async get(@Body() body: GetBankAccountDto) {
    let result = undefined;

    if (!body.code) {
      const bankAccount = await this.getBankAccountUsecase.execute(
        'id',
        body.id,
        ['user'],
      );

      if (!bankAccount) {
        throw new BadRequestException(`Bank account with ${body.id} not found`);
      }
      result = {
        id: bankAccount?.id,
        fullName: bankAccount.user?.fullName,
      };
    } else {
      result = (await this.getAnotherBankAccountUsecase.execute(body.id)).data;
    }

    return {
      id: result.id,
      fullName: result.fullName,
    };
  }

  @Route(BankAccountRouteByCustomer.depositToAccount)
  async deposit(@Body() body: DepositDto) {
    const bankAccount = await this.getBankAccountUsecase.execute(
      'id',
      body.id,
      ['user'],
    );

    if (!bankAccount) {
      throw new BadRequestException(`Bank account ${body.id} not found`);
    }

    if (bankAccount.user.email !== body.email) {
      throw new BadRequestException(
        `Email ${body.email} is not belong to this bank account`,
      );
    }

    const check = await this.changeBalanceUsecase.execute(
      bankAccount.id,
      bankAccount.balance + body.amount,
    );

    return check;
  }
}
