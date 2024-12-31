import { ApiProperty, PickType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { IsString } from 'class-validator';

export class CreateTransactionDto extends PickType(TransactionDto, [
  'remitterId',
  'beneficiaryId',
  'beneficiaryBankId',
  'amount',
  'message',
  'remitterPaidFee',
]) {}

export class TransactionData {
  @ApiProperty()
  @IsString()
  data!: string;
}

export class CreateTransactionForExternalBankDto extends PickType(
  TransactionDto,
  [
    'id',
    'remitterId',
    'remitterName',
    'beneficiaryId',
    'beneficiaryName',
    'amount',
    'message',
    'remitterPaidFee',
    'transactionFee',
  ],
) {}
