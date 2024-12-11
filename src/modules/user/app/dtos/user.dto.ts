import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dtos/base.dto';

export class UserDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty()
  @IsBoolean()
  verifiedEmail!: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  additionalEmail?: string;

  @ApiProperty()
  @IsEmail()
  email!: string;
}
