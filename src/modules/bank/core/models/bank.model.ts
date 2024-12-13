import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from '../../../../common/models';

export interface BankModelParams extends BaseModelParams {
  code: string;
  name: string;
  shortName: string;
  publicKey: string;
  logoUrl: string | undefined;
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

  @ApiPropertyOptional()
  public readonly logoUrl: string | undefined;

  constructor(partial: Partial<BankModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
