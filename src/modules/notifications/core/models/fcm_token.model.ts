import { ApiProperty } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from '../../../../common/models';

export interface FcmTokenModelParams extends BaseModelParams {
  userId: string;
  token: string;
}

export class FcmTokenModel extends BaseModel {
  @ApiProperty()
  public readonly userId: string;

  @ApiProperty()
  public readonly token: string;

  constructor(partial: Partial<FcmTokenModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
