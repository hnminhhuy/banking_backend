import { PickType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';

export class GetTransactionDto extends PickType(TransactionDto, ['id']) {}
