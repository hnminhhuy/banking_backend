import { BadRequestException, Injectable } from '@nestjs/common';
import { AnotherBankService } from './another_bank.service';
import { TransactionModelParams } from '../../../transactions/core/models/transaction.model';

@Injectable()
export class TransactionService extends AnotherBankService {
  async createTransaction(
    params: TransactionModelParams,
  ): Promise<Record<string, any>> {
    const response = await this.safeRequest(
      'POST',
      `${this.getBaseUrl()}/api/another-bank/v1/transactions`,
      {
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
