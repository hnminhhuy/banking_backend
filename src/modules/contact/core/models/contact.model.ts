import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from 'src/common/models';

export interface ContactModelParams extends BaseModelParams {
  userId?: string;
  bankId: string;
  beneficiaryId: string;
  beneficiaryName?: string;
  nickname?: string;
}

export class ContactModel extends BaseModel {
  @ApiProperty()
  public readonly userId: string;

  @ApiProperty()
  public readonly bankId: string;

  @ApiProperty()
  public readonly beneficiaryId: string;

  @ApiProperty()
  public readonly beneficiaryName: string;

  @ApiPropertyOptional()
  public readonly nickname: string;

  constructor(partial: Partial<ContactModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
