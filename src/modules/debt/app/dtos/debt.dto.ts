import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dtos';
import { Status } from '../../core/enum/status';
import { Min } from 'class-validator';

export class DebtDto extends BaseDto {
  @ApiProperty()
  public reminderId!: string;

  @ApiProperty()
  public debtorId!: string;

  @ApiProperty()
  @Min(0, { message: 'Amount must be a non-negative number.' })
  public amount!: number;

  @ApiProperty()
  public status!: Status;

  @ApiProperty()
  public message?: string;
}

export class CreateDebtDto extends PickType(DebtDto, [
  'debtorId',
  'amount',
  'message',
]) {}
