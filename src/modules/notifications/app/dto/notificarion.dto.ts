import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { PaginationDto } from '../../../../common/dtos';
import { IsEnum, IsOptional } from 'class-validator';
import { NotificationType } from '../../core/enums/notification_type';

export class NotificationDto extends PickType(PaginationDto, [
  'page',
  'limit',
]) {
  @ApiPropertyOptional({ enum: NotificationType })
  @IsOptional()
  @IsEnum(NotificationType)
  type!: NotificationType;
}
