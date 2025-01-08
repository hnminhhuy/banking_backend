import { ApiProperty, PickType } from '@nestjs/swagger';
import { BankAccountDto } from './bank_account.dto';
import { IsString, Length } from 'class-validator';

export class GetBankAccountDto extends PickType(BankAccountDto, ['id']) {
  @ApiProperty({
    description: 'The code of the bank.',
    example: 'NHB', // Example value for bank code
  })
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
