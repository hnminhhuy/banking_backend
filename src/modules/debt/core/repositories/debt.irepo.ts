import { DebtModel } from '../models/debt.model';

export abstract class IDebtRepo {
  public abstract create(debt: DebtModel): Promise<void>;
}
