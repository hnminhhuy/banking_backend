import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from 'src/common/models';
import { UserRole } from '../enums/user_role';

export interface UserModelParams extends BaseModelParams {
  created_by: string | undefined;
  email: string;
  userName: string;
  password: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
}

export class UserModel extends BaseModel {
  @ApiPropertyOptional()
  public readonly createdBy: string | undefined;

  @ApiProperty()
  public readonly email: string;

  @ApiProperty()
  public readonly username: string;

  @ApiProperty()
  public readonly password: string;

  @ApiProperty()
  public readonly isActive: boolean;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly role: UserRole;

  constructor(partial: Partial<UserModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
