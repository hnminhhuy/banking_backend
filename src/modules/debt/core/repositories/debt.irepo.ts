import { Page, PageParams, SortParams } from 'src/common/models';
import { DebtModel, DebtModelParams } from '../models/debt.model';
import { DebtSort } from '../enum/debt_sort';

export abstract class IDebtRepo {
  public abstract create(debt: DebtModel): Promise<void>;
  public abstract getDebt(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<DebtModel | undefined>;

  public abstract list(
    conditions: Partial<DebtModelParams>,
    pageParams: PageParams,
    sortParams: SortParams<DebtSort>,
    relations: string[] | undefined,
  ): Promise<Page<DebtModel>>;
}
