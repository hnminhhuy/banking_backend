import { Injectable } from '@nestjs/common';
import { IDebtRepo } from '../repositories/debt.irepo';
import { DebtModel } from '../models/debt.model';
import { DebtorNameModel } from '../models/debtor_name.model';

@Injectable()
export class GetAllDebtorUsecase {
  constructor(private readonly iDebtRepo: IDebtRepo) {}

  public async execute(
    remiderId: string,
  ): Promise<DebtorNameModel[] | undefined> {
    return this.iDebtRepo.getAllDebtor(remiderId);
  }
}
