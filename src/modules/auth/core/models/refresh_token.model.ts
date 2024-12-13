import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthProvider } from '../enums/auth.provider';
import { UserRole } from 'src/modules/user/core/enums/user_role';

export interface RefreshTokenModelParams {
  id: string;
  refreshToken: string;
  authId: string;
  provider: AuthProvider;
  issuedAt: Date;
}

export interface PayloadModel {
  authId: string;
  userRole: UserRole;
  provider: AuthProvider;
}

export class RefreshTokenModel {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public refreshToken: string;

  @ApiPropertyOptional()
  public readonly authId: string;

  @ApiProperty()
  public readonly provider: AuthProvider;

  @ApiProperty()
  public readonly issuedAt: Date;

  constructor(partial: Partial<RefreshTokenModel>) {
    Object.assign(this, partial);
  }
}
