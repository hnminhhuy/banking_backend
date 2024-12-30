import { Injectable } from '@nestjs/common';
import { ITransactionRepo } from '../repositories/transaction.irepo';
import { BankModel } from '../../../bank/core/models/bank.model';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { BankCode } from '../../../bank/core/enums/bank_code';

@Injectable()
export class StatisticTransactionUsecase {
  constructor(
    private readonly transactionRepo: ITransactionRepo,
    private readonly getBankUsecase: GetBankUsecase,
    private readonly bankCode: BankCode,
  ) {}

  public async execute(externalBank: BankModel): Promise<any> {
    const bank = await this.getBankUsecase.execute(
      'code',
      this.bankCode.DEFAULT,
    );

    return await this.transactionRepo.statistic(bank, externalBank);
  }
}
