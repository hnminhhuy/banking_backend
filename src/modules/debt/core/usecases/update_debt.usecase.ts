import { Injectable } from '@nestjs/common';
import { IDebtRepo } from '../repositories/debt.irepo';
import { DebtStatus } from '../enum/debt_status';

@Injectable()
export class UpdateDebtUsecase {
  constructor(private readonly debtRepo: IDebtRepo) {}
  public async execute(debtId: string, status: DebtStatus): Promise<boolean> {
    return await this.debtRepo.update(debtId, status);
  }
}
