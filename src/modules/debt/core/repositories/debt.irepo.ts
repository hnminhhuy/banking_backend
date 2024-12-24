import { DebtModel } from '../models/debt.model';

export abstract class IDebtRepo {
  public abstract create(debt: DebtModel): Promise<void>;
  public abstract getDebt(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<DebtModel | undefined>;
}
