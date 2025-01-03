import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactUserModel {
  @ApiProperty()
  public readonly beneficiaryId: string;

  @ApiProperty()
  public readonly beneficiaryName: string;

  @ApiPropertyOptional()
  public readonly nickname: string;

  @ApiProperty()
  public readonly bankCode: string;

  @ApiProperty()
  public readonly bankName: string;

  @ApiProperty()
  public readonly bankShortName: string;

  constructor(partial: Partial<ContactUserModel>) {
    Object.assign(this, partial);
  }
}

export class AllContactUserModel extends ContactUserModel {
  @ApiProperty()
  public readonly bankId: string;

  constructor(partial: Partial<AllContactUserModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
