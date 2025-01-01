import { ApiProperty } from '@nestjs/swagger';
import { BaseModelParams } from '../../../../common/models';

export interface FcmTokenModelParams extends BaseModelParams {
  userId: string;
  token: string;
}

export class FcmTokenModel {
  @ApiProperty()
  public readonly userId: string;

  @ApiProperty()
  public readonly token: string;

  constructor(partial: Partial<FcmTokenModel>) {
    Object.assign(this, partial);
  }
}
