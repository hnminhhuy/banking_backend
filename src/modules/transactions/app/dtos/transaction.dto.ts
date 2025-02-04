import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/dtos';
import {
  IsBoolean,
  IsNumber,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { parseBoolean } from '../../../../common/helpers/parse_boolean';
import { TransactionStatus } from '../../core/enums/transaction_status';
import { TransactionType } from '../../core/enums/transaction_type';
import { ValidateFieldDifferent } from '../../../../decorators/different_field.decorator';

export class TransactionDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @Validate(ValidateFieldDifferent, ['beneficiaryId'], {
    message: 'remitterId must be different from beneficiaryId',
  })
  remitterId!: string;

  @ApiProperty()
  @IsString()
  @Validate(ValidateFieldDifferent, ['remitterId'], {
    message: 'beneficiaryId must be different from remitterId',
  })
  beneficiaryId!: string;

  @ApiProperty()
  @IsString()
  beneficiaryBankId!: string;

  @ApiProperty()
  @IsString()
  beneficiaryName!: string;

  @ApiProperty()
  @IsString()
  remitterName!: string;

  @ApiProperty()
  @IsString()
  remitterBankId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  amount!: number;

  @ApiProperty()
  @IsString()
  message!: string;

  @ApiProperty()
  @IsNumber()
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
