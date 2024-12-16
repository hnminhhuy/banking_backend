import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/dtos';
import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { parseBoolean } from '../../../../common/helpers/parse_boolean';
import { TransactionStatus } from '../../core/enums/transaction_status';
import { TransactionType } from '../../core/enums/transaction_type';

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
  @IsString()
  status: TransactionStatus;

  @ApiProperty()
  @IsString()
  type: TransactionType;

  @ApiProperty()
  @IsBoolean()
  @Transform((value: any) => parseBoolean(value.obj?.remitterPaidFee, false))
  remitterPaidFee: boolean;
}
