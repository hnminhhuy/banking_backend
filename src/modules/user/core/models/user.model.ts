import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from 'src/common/models';
import { UserRole } from '../enums/user_role';
import * as bcrypt from 'bcrypt';
import { BankAccountModel } from 'src/modules/bank_account/core/models/bank_account.model';
import { BankAccountEntity } from 'src/modules/bank_account/infra/data/entities/bank_account.entity';

export interface UserModelParams extends BaseModelParams {
  createdBy: string | undefined;
  email: string;
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  isBlocked: boolean;
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
  public readonly isBlocked: boolean;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly role: UserRole;
  //** Relation */
  @ApiPropertyOptional()
  public readonly bankAccount: BankAccountModel | undefined | BankAccountEntity;

  public verifyPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  public static async hashPassword(newPassword: string): Promise<string> {
    const salt = await bcrypt.genSaltSync(10);
    return await bcrypt.hashSync(newPassword, salt);
  }

  constructor(partial: Partial<UserModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
