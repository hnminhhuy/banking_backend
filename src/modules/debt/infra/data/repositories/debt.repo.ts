import { Injectable } from '@nestjs/common';
import { DebtModel } from 'src/modules/debt/core/models/debt.model';
import { IDebtRepo } from 'src/modules/debt/core/repositories/debt.irepo';
import { DebtDatasource } from '../../debt.datasource';

@Injectable()
export class DebtRepo implements IDebtRepo {
  constructor(private readonly debtDatasource: DebtDatasource) {}
  public async create(debt: DebtModel): Promise<void> {
    await this.debtDatasource.create(debt);
  }
}
