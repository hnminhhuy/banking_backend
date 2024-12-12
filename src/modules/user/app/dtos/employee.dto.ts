import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsString,
  IsStrongPassword,
  IsUUID,
  Length,
} from 'class-validator';
import { BaseDto } from 'src/common/dtos';
import { UserRole } from '../../core/enums/user_role';

export class EmployeeDto extends BaseDto {
  @ApiProperty()
  @IsUUID()
  public createdBy?: string;

  @ApiProperty()
  @IsEmail()
  @IsDefined()
  public email!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(10, 100)
  public username: string;

  @ApiProperty()
  @IsDefined()
  @IsStrongPassword()
  public password: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(3, 100)
  public fullName!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public role: UserRole;
}
