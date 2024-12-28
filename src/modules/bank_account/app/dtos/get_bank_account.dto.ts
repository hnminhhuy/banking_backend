import { ApiProperty, PickType } from '@nestjs/swagger';
import { BankAccountDto } from './bank_account.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class GetBankAccountDto extends PickType(BankAccountDto, ['id']) {
  @IsOptional()
  @IsString()
  @Length(3, 10)
  code?: string;
}

export class GetBankAccountQuery {
  @ApiProperty()
  includeUser?: boolean;
}
