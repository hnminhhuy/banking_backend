import { PickType } from '@nestjs/swagger';
import { BankAccountDto } from './bank_account.dto';

export class GetBankAccountDto extends PickType(BankAccountDto, ['id']) {}
