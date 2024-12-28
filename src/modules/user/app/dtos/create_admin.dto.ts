import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class CreateAdminDto extends PickType(UserDto, [
  'email',
  'fullName',
  'password',
  'username',
]) {}
