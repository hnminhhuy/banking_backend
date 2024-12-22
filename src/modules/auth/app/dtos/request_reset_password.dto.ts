import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';

export class RequestResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsDefined()
  public email: string;
}
