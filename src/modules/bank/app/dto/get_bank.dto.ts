import { PickType } from '@nestjs/swagger';
import { BankDto } from './bank.dto';

export class GetBankDto extends PickType(BankDto, ['id']) {}
