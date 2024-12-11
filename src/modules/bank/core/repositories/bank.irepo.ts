import { BankModel } from '../models/bank.model';

export abstract class IBankRepo {
  public abstract create(bank: BankModel): Promise<void>;
  public abstract get(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<BankModel | undefined>;
}
