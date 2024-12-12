import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthProvider } from '../enums/auth.provider';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from 'src/modules/user/core/enums/user_role';

export interface RefreshTokenModelParams {
  id: string;
  refreshToken: string;
  authId: string | undefined;
  provider: AuthProvider;
  issuedAt: Date;
}

export interface PayloadModel {
  authId: string | undefined;
  userRole: UserRole;
  provider: AuthProvider;
}

export class RefreshTokenModel {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public refreshToken: string;

  @ApiPropertyOptional()
  public readonly authId: string | undefined;

  @ApiProperty()
  public readonly provider: AuthProvider;

  @ApiProperty()
  public readonly issuedAt: Date;

  constructor(partial: Partial<RefreshTokenModel>) {
    Object.assign(this, partial);
  }
}
