import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class LoginDto extends PickType(AuthDto, ['username', 'password']) {}
