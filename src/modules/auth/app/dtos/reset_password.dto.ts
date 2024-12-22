import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public newPassword: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public confirmPassword: string;
}
