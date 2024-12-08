import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dtos/base.dto';

export class UserDto extends BaseDto {
  @ApiProperty({ description: 'Username of the user', required: false })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({
    description: 'Indicates if the user has verified their email',
  })
  @IsBoolean()
  verifiedEmail!: boolean;

  @ApiProperty({
    description: 'Student ID associated with the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiProperty({
    description: 'Additional email associated with the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  additionalEmail?: string;

  @ApiProperty({ description: 'Primary email of the user' })
  @IsEmail()
  email!: string;
}
