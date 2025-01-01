import { BaseModel } from '../../../../common/models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../enums/notification_type';

export interface NotificationModelParams {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  readAt?: Date;
}
export class NotificationModel extends BaseModel {
  @ApiProperty()
  public readonly userId: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly body: string;

  @ApiProperty()
  public readonly type: NotificationType;

  @ApiPropertyOptional()
  public readonly readAt: Date | undefined;

  constructor(partial: Partial<NotificationModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
