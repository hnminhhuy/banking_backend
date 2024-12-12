import { Controller, Param } from '@nestjs/common';
import { GetBankAccountUsecase } from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import { GetBankAccountDto } from '../../dtos';
import { BankAccountRouteByCustomer } from '../../routes/customer/bank_account.route';

@Controller({ path: 'api/customer/v1/bank-accounts' })
export class BankAccountController {
  constructor(private getBankAccountUsecase: GetBankAccountUsecase) {}

  @Route(BankAccountRouteByCustomer.getBankAccount)
  async get(@Param() param: GetBankAccountDto) {
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
