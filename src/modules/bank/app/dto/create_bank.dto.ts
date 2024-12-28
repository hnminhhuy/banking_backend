import { PickType } from '@nestjs/swagger';
import { BankDto } from './bank.dto';

export class CreateBankDto extends PickType(BankDto, [
  'code',
  'name',
  'shortName',
  'logoUrl',
  'publicKey',
]) {}
