import { ApiProperty, PickType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { IsString } from 'class-validator';

export class VerifyTransactionDto extends PickType(TransactionDto, ['id']) {
  @IsString()
  @ApiProperty()
  otp!: string;
}
