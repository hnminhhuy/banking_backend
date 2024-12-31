import { BadRequestException, Injectable } from '@nestjs/common';
import { ExternalBankService } from './external_bank.service';
import { TransactionModelParams } from '../../../transactions/core/models/transaction.model';

@Injectable()
export class TransactionService extends ExternalBankService {
  async createTransaction(
    params: TransactionModelParams,
  ): Promise<Record<string, any>> {
    const data = await this.jwtService.sign(
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
      {
        expiresIn: '5m',
        secret: this.configService.get<string>('auth.jwt.publicKey'),
      },
    );
    const response = await this.safeRequest(
      'POST',
      `${this.getBaseUrl()}/api/external-bank/v1/transactions`,
      {
        data: data,
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
