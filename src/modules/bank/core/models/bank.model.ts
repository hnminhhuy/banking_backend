import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from '../../../../common/models';

export interface BankModelParams extends BaseModelParams {
  code: string;
  name: string;
  shortName: string;
  publicKey: string;
  logoUrl: string | undefined;
  algorithm: string;
  metadata?: Record<string, any> | undefined;
}

export class BankModel extends BaseModel {
  @ApiProperty()
  public readonly code: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly shortName: string;

  @ApiProperty()
  public readonly publicKey: string;

  @ApiProperty()
  public readonly alogrithm: string;

  @ApiPropertyOptional()
  public readonly logoUrl: string | undefined;

  @ApiPropertyOptional()
  public readonly metadata: Record<string, any> | undefined;

  constructor(partial: Partial<BankModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
