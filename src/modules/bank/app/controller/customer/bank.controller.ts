import { Controller, Param, Query } from '@nestjs/common';
import { GetBankUsecase, ListBanksUsecase } from '../../../core/usecases';
import { Route } from '../../../../../decorators';
import { GetBankDto, ListBankDto } from '../../dto';
import { PageParams, SortParams } from '../../../../../common/models';
import { BankSort } from '../../../core/enums/bank_sort';
import bankRoute from '../../routes/customer/bank.route';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({ path: 'api/customer/v1/banks' })
@ApiBearerAuth()
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

    const sortParams: SortParams<BankSort> = new SortParams(
      query.sort as BankSort,
      query.direction,
    );
    const banks = await this.listBanksUsecase.execute(pageParams, sortParams);

    const responseData = banks.data.map((bank) => {
      const {
        publicKey,
        id,
        algorithm: alogrithm,
        createdAt,
        updatedAt,
        metadata,
        logoUrl,
        ...bankData
      } = bank;
      return bankData;
    });

    return {
      data: responseData,
      metadata: {
        page: banks.page,
        totalCount: banks.totalCount,
      },
    };
  }

  @Route(bankRoute.getBank)
  async get(@Param() param: GetBankDto) {
    const bank = await this.getBankUsecase.execute('id', param.id, undefined);
    const { publicKey, id, createdAt, updatedAt, metadata, ...bankData } = bank;

    return bankData;
  }
}
