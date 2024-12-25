import { Page, PageParams, SortParams } from 'src/common/models';
import { DebtModel, DebtModelParams } from '../models/debt.model';
import { DebtSort } from '../enum/debt_sort';
import { DebtStatus } from '../enum/debt_status';

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

  public abstract cancelDebt(debtId: string): Promise<boolean>;
  public abstract update(debtId: string, status: DebtStatus): Promise<boolean>;
}
