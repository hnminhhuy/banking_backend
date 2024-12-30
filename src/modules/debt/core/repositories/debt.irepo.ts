import { Page, PageParams, SortParams } from 'src/common/models';
import { DebtModel, DebtModelParams } from '../models/debt.model';
import { DebtSort } from '../enum/debt_sort';
import { DebtorNameModel } from '../models/debtor_name.model';

export abstract class IDebtRepo {
  public abstract create(debt: DebtModel): Promise<void>;
  public abstract getDebt(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<DebtModel | undefined>;

  public abstract getDebtWithUser(id: string): Promise<DebtModel | undefined>;

  public abstract getAllDebtor(
    remiderId: string,
  ): Promise<DebtorNameModel[] | undefined>;
  public abstract list(
    conditions: Partial<DebtModelParams>,
    pageParams: PageParams,
    sortParams: SortParams<DebtSort>,
    relations: string[] | undefined,
  ): Promise<Page<DebtModel>>;

  public abstract listDebtWithUser(
    conditions: Partial<DebtModelParams>,
    pageParams: PageParams,
    sortParams: SortParams<DebtSort>,
  ): Promise<Page<DebtModel>>;

  public abstract cancelDebt(debtId: string): Promise<boolean>;
}
