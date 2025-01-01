import { BaseModel } from '../../../../common/models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface NotificationModelParams {
  title: string;
  body: string;
  readAt?: Date;
}
export class NotificationModel extends BaseModel {
  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly body: string;

  @ApiPropertyOptional()
  public readonly readAt: Date | undefined;

  constructor(partial: Partial<NotificationModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
