import { BadRequestException, Body, Controller } from '@nestjs/common';
import {
  ChangeBalanceUsecase,
  GetBankAccountUsecase,
} from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import { DepositDto, GetBankAccountDto } from '../../dtos';
import { BankAccountRouteByCustomer } from '../../routes/customer/bank_account.route';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetExternalBankAccountInfoUsecase } from '../../../../external-bank/core/usecases/bank_account/get_external_bank_user.usecase';
import { BankCode } from 'src/modules/bank/core/enums/bank_code';
import { GetBankUsecase } from '../../../../bank/core/usecases';
import { throwError } from '../../../../../common/helpers/throw_error';

@ApiTags('Bank Account For Customer')
@Controller({ path: 'api/customer/v1/bank-accounts' })
@ApiBearerAuth()
export class BankAccountController {
  constructor(
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getExternalBankAccountUsecase: GetExternalBankAccountInfoUsecase,
    private readonly changeBalanceUsecase: ChangeBalanceUsecase,
    private readonly bankCode: BankCode,
    private readonly getBankUsecase: GetBankUsecase,
  ) {}

  @Route(BankAccountRouteByCustomer.getBankAccount)
  async get(@Body() body: GetBankAccountDto) {
    let result = undefined;

    if (body.code === this.bankCode.DEFAULT) {
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
      const bank = await this.getBankUsecase.execute('code', body.code);
      result = (
        (await this.getExternalBankAccountUsecase.execute(bank, body.id)) ??
        throwError()
      ).data;
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
      body.amount,
    );

    return check;
  }
}
