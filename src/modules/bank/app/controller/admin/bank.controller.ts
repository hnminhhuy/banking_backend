import { Controller, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Route } from 'src/decorators';
import { ListBanksUsecase } from 'src/modules/bank/core/usecases';
import { ListBankDto } from '../../dto';
import { PageParams, SortParams } from 'src/common/models';
import { BankSort } from 'src/modules/bank/core/enums/bank_sort';
import bankRoute from '../../routes/admin/bank.route';

@Controller({ path: 'api/admin/v1/banks' })
@ApiBearerAuth()
export class AdminBankController {
  constructor(private readonly listBanksUsecase: ListBanksUsecase) {}

  @Route(bankRoute.listBank)
  async list(@Query() query: ListBankDto) {
    const pageParams = new PageParams(
      query.page,
      query.limit,
      query.needTotalCount,
      query.onlyCount,
    );

    const sortParams: SortParams<BankSort> = new SortParams(
      query.sort as BankSort,
      query.direction,
    );
    const banks = await this.listBanksUsecase.execute(pageParams, sortParams);

    banks.data.map((bank) => {
      const { publicKey, id, createdAt, updatedAt, ...bankData } = bank;
      return bankData;
    });

    return {
      data: banks.data,
      metadata: {
        page: banks.page,
        totalCount: banks.totalCount,
      },
    };
  }
}
