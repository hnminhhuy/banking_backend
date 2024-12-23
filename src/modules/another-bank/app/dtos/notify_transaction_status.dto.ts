import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { TransactionStatus } from '../../../transactions/core/enums/transaction_status';

export class NotifyTransactionStatusDto {
  @ApiProperty()
  @IsUUID()
  id!: string;

  @ApiProperty()
  @IsEnum(TransactionStatus)
  status!: TransactionStatus;
}
