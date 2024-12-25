import { Injectable } from '@nestjs/common';
import {
  DebtModel,
  DebtModelParams,
} from 'src/modules/debt/core/models/debt.model';
import { IDebtRepo } from 'src/modules/debt/core/repositories/debt.irepo';
import { DebtDatasource } from '../../debt.datasource';
import { PageParams, SortParams, Page } from 'src/common/models';
import { DebtSort } from 'src/modules/debt/core/enum/debt_sort';

@Injectable()
export class DebtRepo implements IDebtRepo {
  constructor(private readonly debtDatasource: DebtDatasource) {}

  public async create(debt: DebtModel): Promise<void> {
    await this.debtDatasource.create(debt);
  }
  public getDebt(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<DebtModel | undefined> {
    return this.debtDatasource.getDebt(key, value, relations);
  }

  public async list(
    conditions: Partial<DebtModelParams>,
    pageParams: PageParams,
    sortParams: SortParams<DebtSort>,
    relations: string[] | undefined,
  ): Promise<Page<DebtModel>> {
    return await this.debtDatasource.list(
      conditions,
      pageParams,
      sortParams,
      relations,
    );
  }

  public async cancelDebt(debtId: string): Promise<boolean> {
    return await this.debtDatasource.cancelDebt(debtId);
  }
}
