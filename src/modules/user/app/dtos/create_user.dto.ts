import { IntersectionType, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { BankAccountDto } from '../../../bank_account/app/dtos';

export class CreateUserDto extends PickType(UserDto, [
  'email',
  'username',
  'fullName',
]) {}

export class CreateCustomerDto extends IntersectionType(
  PickType(UserDto, ['email', 'username', 'password', 'fullName']),
  PickType(BankAccountDto, ['balance']),
) {}
