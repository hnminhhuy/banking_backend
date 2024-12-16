import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/dtos';
import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { parseBoolean } from '../../../../common/helpers/parse_boolean';

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
  @Min(1)
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
  @Transform((value: any) => parseBoolean(value.obj?.remitterPaidFee, false))
  remitterPaidFee: boolean;
}
