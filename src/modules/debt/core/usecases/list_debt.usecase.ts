import { Injectable } from '@nestjs/common';
import { IDebtRepo } from '../repositories/debt.irepo';
import { DebtModel, DebtModelParams } from '../models/debt.model';
import { PageParams, SortParams } from 'src/common/models';
import { DebtSort } from '../enum/debt_sort';

@Injectable()
export class ListDebtUsecase {
  constructor(private readonly iDebtRepo: IDebtRepo) {}

  public async execute(
    conditions: Partial<DebtModelParams>,
    pageParams: PageParams,
    sortParams: SortParams<DebtSort>,
    relations: string[] | undefined = undefined,
  ) {
    return await this.iDebtRepo.list(
      conditions,
      pageParams,
      sortParams,
      relations,
    );
  }
}
