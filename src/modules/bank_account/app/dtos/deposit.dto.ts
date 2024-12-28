import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { UserDto } from '../../../user/app/dtos';
import { BankAccountDto } from './bank_account.dto';
import { IsNumber, Max, Min } from 'class-validator';

export class DepositDto extends IntersectionType(
  PickType(UserDto, ['email']),
  PickType(BankAccountDto, ['id']),
) {
  @ApiProperty()
  @IsNumber()
  @Max(Number.MAX_SAFE_INTEGER)
  @Min(0)
  amount!: number;
}
