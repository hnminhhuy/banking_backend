import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetBankUsecase, ListBanksUsecase } from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import bankRoute from '../../routes/customer/bank.route';
import { GetBankDto, ListBankDto } from '../../dto';
import { PageParams, SortParams } from '../../../../../common/models';
import { BANK_SORT_KEY as BANK_SORT_KEY } from '../../../core/enums/bank_sort_key';

@Controller({ path: 'api/customer/v1/banks' })
export class BankController {
  constructor(
    private readonly listBanksUsecase: ListBanksUsecase,
    private readonly getBankUsecase: GetBankUsecase,
  ) {}

  @Route(bankRoute.listBank)
  async list(@Query() query: ListBankDto) {
    const pageParams = new PageParams(
      query.page,
      query.limit,
      query.needTotalCount,
      query.onlyCount,
    );

    const sortParams: SortParams<BANK_SORT_KEY> = new SortParams(
      query.sort as BANK_SORT_KEY,
      query.direction,
    );
    const banks = await this.listBanksUsecase.execute(pageParams, sortParams);

    return banks.data.map((bank) => {
      const { publicKey, id, createdAt, updatedAt, ...bankData } = bank;
      return bankData;
    });
  }

  @Route(bankRoute.getBank)
  async get(@Param() param: GetBankDto) {
    const bank = await this.getBankUsecase.execute('id', param.id, undefined);
    const { publicKey, id, createdAt, updatedAt, ...bankData } = bank;

    return bankData;
  }
}
