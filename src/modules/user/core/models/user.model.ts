import { ApiProperty } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from 'src/common/models';

export interface UserModelParams extends BaseModelParams {
  email: string;
  additionalEmail?: string;
  userName?: string;
  verifiedEmail?: boolean;
  studentId?: string;
}

export class UserModel extends BaseModel {
  @ApiProperty()
  public readonly userName: string | undefined;

  @ApiProperty()
  public readonly verifiedEmail: boolean;

  @ApiProperty()
  public readonly studentId: string | undefined;

  @ApiProperty()
  public readonly additionalEmail: string | undefined;

  @ApiProperty()
  public readonly email: string;

  constructor(params: Partial<UserModelParams>) {
    super(params);
    Object.assign(this, params);
  }
}
