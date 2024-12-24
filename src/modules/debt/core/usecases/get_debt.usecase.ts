import { Injectable } from '@nestjs/common';
import { IDebtRepo } from '../repositories/debt.irepo';
import { DebtModel } from '../models/debt.model';

@Injectable()
export class GetDebtUsecase {
  constructor(private readonly iDebtRepo: IDebtRepo) {}

  public async execute(
    key: string,
    value: unknown,
    relations: string[] | undefined = undefined,
  ): Promise<DebtModel | undefined> {
    return this.iDebtRepo.getDebt(key, value, relations);
  }
}
