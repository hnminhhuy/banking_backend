import { Controller, Param, Query } from '@nestjs/common';
import { GetBankAccountUsecase } from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import { GetBankAccountDto } from '../../dtos';
import { BankAccountRouteByEmployee } from '../../routes/employee/bank_account.route';
import { PageParams, SortParams } from '../../../../../common/models';
import { ListBankAccountDto } from '../../dtos/list_bank_account.dto';
import { BANK_ACCOUNT_SORT_KEY } from '../../../core/enums/bank_account_sort_key';
import { ListBankAccountsUsecase } from '../../../core/usecases/list_bank_account.usecase';

@Controller({ path: 'api/customer/v1/bank-accounts' })
export class BankAccountController {
  constructor(
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly listBankAccountsUsecase: ListBankAccountsUsecase,
  ) {}

  @Route(BankAccountRouteByEmployee.getBankAccount)
  async get(@Param() param: GetBankAccountDto) {
    const bankAccount = await this.getBankAccountUsecase.execute(
      'id',
      param.id,
      undefined,
    );
    return bankAccount;
  }

  @Route(BankAccountRouteByEmployee.listBank)
  async list(@Query() query: ListBankAccountDto) {
    const pageParams = new PageParams(
      query.page,
      query.limit,
      query.needTotalCount,
      query.onlyCount,
    );

    const sortParams: SortParams<BANK_ACCOUNT_SORT_KEY> = new SortParams(
      query.sort as BANK_ACCOUNT_SORT_KEY,
      query.direction,
    );
    const bankAccounts = await this.listBankAccountsUsecase.execute(
      pageParams,
      sortParams,
    );

    return bankAccounts;
  }
}
