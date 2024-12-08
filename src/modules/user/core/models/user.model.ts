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
  @ApiProperty({
    description: 'User name of the user',
    required: false,
    name: 'username',
  })
  public readonly userName: string | undefined;

  @ApiProperty({
    description: 'Indicates if the email is verified',
    name: 'verified_email',
  })
  public readonly verifiedEmail: boolean;

  @ApiProperty({
    description: 'Student ID if applicable',
    required: false,
    name: 'student_id',
  })
  public readonly studentId: string | undefined;

  @ApiProperty({
    description: 'Additional email for the user if applicable',
    required: false,
    name: 'additional_email',
  })
  public readonly additionalEmail: string | undefined;

  @ApiProperty({ description: 'Primary email of the user', name: 'email' })
  public readonly email: string;

  constructor(params: Partial<UserModelParams>) {
    super(params);
    Object.assign(this, params);
  }
}
