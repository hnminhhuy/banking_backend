import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthProvider } from '../enums/auth.provider';
import { v4 as uuidv4 } from 'uuid';

export interface RefreshTokenModelParams {
  id: string;
  refreshToken: string;
  userId: string | undefined;
  bankId: string | undefined;
  provider: AuthProvider;
  issuedAt: Date;
}

export interface PayloadModel {
  userId: string | undefined;
  bankId: string | undefined;
  provider: AuthProvider;
}

export class RefreshTokenModel {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public refreshToken: string;

  @ApiPropertyOptional()
  public readonly userId: string | undefined;

  @ApiPropertyOptional()
  public readonly bankId: string | undefined;

  @ApiProperty()
  public readonly provider: AuthProvider;

  @ApiProperty()
  public readonly issuedId: Date;

  constructor(partial: Partial<RefreshTokenModel>) {
    Object.assign(this, partial);
    this.id = this.id || uuidv4();
  }
}
