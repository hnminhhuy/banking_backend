import { ApiProperty } from '@nestjs/swagger';
import { PageResponseModel } from 'src/common/models/page_response.model';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationModel } from './notification.model';

export class NotificationPageResponseModel extends PageResponseModel<NotificationModel> {
  @ApiProperty({
    description: 'The list of data for the page.',
    isArray: true,
    type: NotificationModel,
  })
  @IsArray()
  @Type(() => NotificationModel)
  data: NotificationModel[];
}
