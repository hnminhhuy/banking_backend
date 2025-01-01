import { BadRequestException, Injectable } from '@nestjs/common';
import { ExternalBankService } from './external_bank.service';
import { TransactionModelParams } from '../../../transactions/core/models/transaction.model';
import { BankModel } from '../../../bank/core/models/bank.model';

@Injectable()
export class TransactionService extends ExternalBankService {
  async createTransaction(
    externalBank: BankModel,
    params: TransactionModelParams,
  ): Promise<Record<string, any>> {
    const sign = await this.jwtService.sign({
      id: params.id,
      remitterId: params.remitterId,
      beneficiaryId: params.beneficiaryId,
      beneficiaryName: params.beneficiaryName,
      remitterName: params.remitterName,
      amount: params.amount,
      message: params.message,
      transactionFee: params.transactionFee,
      remitterPaidFee: params.remitterPaidFee,
    });

    const response = await this.safeRequest(
      externalBank,
      'POST',
      `${this.getBaseUrl(externalBank)}/api/external-bank/v1/transactions`,
      {
        sign: sign,
        id: params.id,
        remitterId: params.remitterId,
        beneficiaryId: params.beneficiaryId,
        beneficiaryName: params.beneficiaryName,
        remitterName: params.remitterName,
        amount: params.amount,
        message: params.message,
        transactionFee: params.transactionFee,
        remitterPaidFee: params.remitterPaidFee,
      },
      {},
    );
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new BadRequestException(response.data.message);
    }
  }
}
