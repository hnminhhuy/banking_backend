import { Controller, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FcmService } from '../../infra/services/fcm.service';
import {
  MultipleDeviceNotificationDto,
  SendNotificationDto,
  TopicNotificationDto,
} from '../dtos/notification.dto';
import { Route } from '../../../../decorators';
import { FcmRoute } from '../routes/fcm.route';

@ApiTags('Public \\ Notifications')
@Controller({ path: 'api/notification/v1' })
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @Route(FcmRoute.sendNotification)
  async sendNotification(@Body() body: SendNotificationDto) {
    return this.fcmService.sendNotification({
      token: body.token,
      title: body.title,
      body: body.body,
      icon: body.icon,
    });
  }

  @Route(FcmRoute.sendMultipleNotifications)
  async sendMultipleNotifications(@Body() body: MultipleDeviceNotificationDto) {
    return this.fcmService.sendNotificationToMultipleTokens({
      tokens: body.tokens,
      title: body.title,
      body: body.body,
      icon: body.icon,
    });
  }

  @Route(FcmRoute.sendTopicNotification)
  async sendTopicNotification(@Body() body: TopicNotificationDto) {
    return this.fcmService.sendTopicNotification({
      topic: body.topic,
      title: body.title,
      body: body.body,
      icon: body.icon,
    });
  }
}
