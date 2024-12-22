import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AnotherBankService } from './another_bank.service';

@Injectable()
export class BankAccountService extends AnotherBankService {
  async getUser(id: string): Promise<Record<string, any>> {
    const response = await this.safeRequest(
      'GET',
      `${this.getBaseUrl()}/api/another-bank/v1/bank-accounts/${id}`,
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
