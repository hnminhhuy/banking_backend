import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { throwError } from '../../../../common/helpers/throw_error';

@Injectable()
export class BankCode {
  public readonly DEFAULT: string;
  public readonly EXTERNAL_BANK: string;

  constructor(private readonly configService: ConfigService) {
    this.DEFAULT =
      this.configService.get<string>('bank.default.code') ?? throwError();
    this.EXTERNAL_BANK =
      this.configService.get<string>('bank.external_bank.code') ?? throwError();
  }
}
