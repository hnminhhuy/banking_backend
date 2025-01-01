import { BadRequestException, Injectable } from '@nestjs/common';
import { ExternalBankService } from './external_bank.service';
import { BankModel } from '../../../bank/core/models/bank.model';

@Injectable()
export class BankAccountService extends ExternalBankService {
  async getUser(
    externalBank: BankModel,
    id: string,
  ): Promise<Record<string, any>> {
    const response = await this.safeRequest(
      externalBank,
      'GET',
      `${this.getBaseUrl(externalBank)}/api/external-bank/v1/bank-accounts/${id}`,
      {},
      {},
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new BadRequestException(response.data.message);
    }
  }
}
