import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { BankModel } from 'src/modules/bank/core/models/bank.model';
import { TransactionModelParams } from 'src/modules/transactions/core/models/transaction.model';

@Injectable()
export class NTBAccountService {
  private privateKey;

  constructor(private readonly configService: ConfigService) {
    this.privateKey = configService.get<string>('auth.jwt.privateKey');
  }

  generateSHA256Hash(data: any, secret_key: string): string {
    const json_data = JSON.stringify(data);
    // console.log(json_data)
    // console.log(secret_key)
    const hash = crypto.createHmac('sha256', secret_key).update(json_data);
    //hash.end();
    //console.log('hash', hash)
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

    const response = await axios.post(metadata.host, payload, {
      headers: {
        Authorization: `Bearer ${metadata.apiKey}`,
        'x-hash': hash,
        'x-client-id': metadata.clientId,
      },
    });

    console.log(response);
    return response;
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
      client_bank_number: transaction.remitterName,
      timestamp: new Date().toISOString(),
      remarks: transaction.message,
      payment_method: transaction.remitterPaidFee
        ? 'Sender Pay'
        : 'Recipient Pay',
      feeL: transaction.transactionFee,
    };
    const signature = this.signMessage(JSON.stringify(payload));
    const hash = this.generateSHA256Hash(payload, metadata.secretKey);
    const response = await axios.post(metadata.host, payload, {
      headers: {
        Authorization: `Bearer ${metadata.apiKey}`,
        'x-hash': hash,
        'x-client-id': metadata.clientId,
        'x-signature': signature,
      },
    });

    return response;
  }
}
