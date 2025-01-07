import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { BankModel } from 'src/modules/bank/core/models/bank.model';
import { TransactionModelParams } from 'src/modules/transactions/core/models/transaction.model';

@Injectable()
export class NTBAccountService {
  private privateKey;

  constructor(private readonly configService: ConfigService) {
    this.privateKey = this.configService.get<string>('auth.jwt.privateKey');
  }

  generateSHA256Hash(data: any, secret_key: string): string {
    const json_data = JSON.stringify(data);
    const hash = crypto.createHmac('sha256', secret_key).update(json_data);
    return hash.digest('hex');
  }

  signMessage(message) {
    const sign = crypto.createSign('sha256');
    sign.update(message);
    sign.end();
    return sign.sign(this.privateKey, 'hex'); // Signature in base64 format
  }

  async getAccountInfo(bank: BankModel, accountId: string) {
    const metadata = bank.metadata.clientConnection;

    const payload = {
      account_number: accountId,
      timestamp: new Date().toISOString(),
    };

    const hash = this.generateSHA256Hash(payload, metadata.secretKey);

    const response = await axios.post(`${metadata.host}api/get-info`, payload, {
      headers: {
        Authorization: `Bearer ${metadata.apiKey}`,
        'x-hash': hash,
        'x-client-id': metadata.clientId,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      const { account_number, name } = response.data;
      const convertedData = {
        data: {
          id: account_number,
          fullName: name,
        },
      };
      return convertedData;
    } else {
      throw new BadRequestException(response.data.message);
    }
  }

  async sendTransaction(
    externalBank: BankModel,
    transaction: TransactionModelParams,
  ) {
    const metadata = externalBank.metadata.clientConnection;
    const payload = {
      our_bank_account_number: transaction.beneficiaryId,
      amount: transaction.amount,
      client_bank_account_number: transaction.remitterId,
      client_bank_name: transaction.remitterName,
      timestamp: new Date().toISOString(),
      remarks: transaction.message,
      payment_method: transaction.remitterPaidFee
        ? 'Sender Pay'
        : 'Recipient Pay',
      fee: transaction.transactionFee,
    };
    const signature = this.signMessage(JSON.stringify(payload));
    const hash = this.generateSHA256Hash(payload, metadata.secretKey);

    const response = await axios.post(
      `${metadata.host}api/add-to-balance`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${metadata.apiKey}`,
          'x-hash': hash,
          'x-client-id': metadata.clientId,
          'x-signature': signature,
        },
      },
    );

    if (!response.data || response.status < 200 || response.status >= 300) {
      throw new BadRequestException(
        response.data?.message || 'An unknown error occurred.',
      );
    }

    return { data: 'success' };
  }
}
