import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiProperty()
  @IsString()
  clientSecret: string;
}

export class OAuthTokenDto extends PickType(AuthDto, [
  'clientId',
  'clientSecret',
]) {}
export class LoginDto extends PickType(AuthDto, ['username', 'password']) {
  @ApiProperty()
  @IsString()
  captchaToken: string;
}
