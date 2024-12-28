import { Controller, Param, Query } from '@nestjs/common';
import { GetBankAccountUsecase } from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import { GetBankAccountDto, GetBankAccountQuery } from '../../dtos';
import { BankAccountRouteByCustomer } from '../../routes/customer/bank_account.route';
import { GetBankAccountWithUserUsecase } from 'src/modules/bank_account/core/usecases/get_bank_account_with_user.usecase';

@Controller({ path: 'api/customer/v1/bank-accounts' })
export class BankAccountController {
  constructor(
    private getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getBankAccountWithUserUsecase: GetBankAccountWithUserUsecase,
  ) {}

  @Route(BankAccountRouteByCustomer.getBankAccount)
  async get(
    @Param() param: GetBankAccountDto,
    @Query() query: GetBankAccountQuery,
  ) {
    if (query.includeUser?.toString() === 'true') {
      const bankAccount = await this.getBankAccountWithUserUsecase.execute(
        param.id,
      );
      return bankAccount;
    }
    const bankAccount = await this.getBankAccountUsecase.execute(
      'id',
      param.id,
      undefined,
    );
    const { createdAt, updatedAt, bankId, userId, ...bankAccountData } =
      bankAccount;

    return bankAccountData;
  }
}
