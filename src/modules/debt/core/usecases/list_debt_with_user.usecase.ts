import { Injectable } from '@nestjs/common';
import { IDebtRepo } from '../repositories/debt.irepo';
import { DebtModel, DebtModelParams } from '../models/debt.model';
import { PageParams, SortParams } from 'src/common/models';
import { DebtSort } from '../enum/debt_sort';

@Injectable()
export class ListDebtWithUserUsecase {
  constructor(private readonly iDebtRepo: IDebtRepo) {}

  public async execute(
    conditions: Partial<DebtModelParams>,
    pageParams: PageParams,
    sortParams: SortParams<DebtSort>,
  ) {
    return await this.iDebtRepo.listDebtWithUser(
      conditions,
      pageParams,
      sortParams,
    );
  }
}
