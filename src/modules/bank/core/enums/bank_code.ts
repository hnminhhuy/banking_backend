import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BankCode {
  public readonly DEFAULT: string;

  constructor(private readonly configService: ConfigService) {
    this.DEFAULT = this.configService.get<string>('bank.default.code');
  }
}
