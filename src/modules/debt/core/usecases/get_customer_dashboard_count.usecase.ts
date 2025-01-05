import { Injectable } from '@nestjs/common';
import { IDebtRepo } from '../repositories/debt.irepo';

@Injectable()
export class GetCustomerDashboardCountUsecase {
  constructor(private readonly debtRepo: IDebtRepo) {}

  public async execute(reminderId: string) {
    return await this.debtRepo.getDashboardCount(reminderId);
  }
}
