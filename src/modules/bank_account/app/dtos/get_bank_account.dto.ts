import { ApiProperty, PickType } from '@nestjs/swagger';
import { BankAccountDto } from './bank_account.dto';
import { IsString, Length } from 'class-validator';

export class GetBankAccountDto extends PickType(BankAccountDto, ['id']) {
  @ApiProperty()
  @IsString()
  @Length(3, 10)
  code: string;
}

export class GetBankAccountExternalDto extends PickType(BankAccountDto, [
  'id',
]) {}

export class GetBankAccountQuery {
  @ApiProperty()
  includeUser?: boolean;
}
