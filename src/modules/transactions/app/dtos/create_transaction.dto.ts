import { PickType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';

export class CreateTransactionDto extends PickType(TransactionDto, [
  'remitterId',
  'beneficiaryId',
  'beneficiaryBankId',
  'amount',
  'message',
  'remitterPaidFee',
]) {}

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