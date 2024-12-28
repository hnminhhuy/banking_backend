import { Injectable } from '@nestjs/common';
import { IDebtRepo } from '../repositories/debt.irepo';
import { DebtModel } from '../models/debt.model';

@Injectable()
export class GetDebtWithUserUsecase {
  constructor(private readonly iDebtRepo: IDebtRepo) {}

  public async execute(id: string): Promise<DebtModel | undefined> {
    return this.iDebtRepo.getDebtWithUser(id);
  }
}
