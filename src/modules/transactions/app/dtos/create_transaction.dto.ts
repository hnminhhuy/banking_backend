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

export class CreateTransactionForAnotherBankDto extends PickType(
  TransactionDto,
  [
    'id',
    'remitterId',
    'remitterName',
    'remitterBankId',
    'beneficiaryId',
    'beneficiaryBankId',
    'beneficiaryName',
    'amount',
    'message',
    'remitterPaidFee',
    'transactionFee',
  ],
) {}
