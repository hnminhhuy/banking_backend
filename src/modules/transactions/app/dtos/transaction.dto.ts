import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/dtos';
import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';

export class TransactionDto extends BaseDto {
  @ApiProperty()
  @IsString()
  remitterId!: string;

  @ApiProperty()
  @IsString()
  beneficiaryId!: string;

  @ApiProperty()
  @IsString()
  beneficiaryBankId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  amount!: number;

  @ApiProperty()
  @IsString()
  message!: string;

  @ApiProperty()
  @IsString()
  transactionFee: number;

  @ApiProperty()
  @IsBoolean()
  remitterPaidFee: boolean;
}
