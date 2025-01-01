import { NotificationModel } from '../models/notification.model';

export abstract class NotificationIRepo {
  abstract create(notification: NotificationModel): Promise<void>;
  abstract list(userId: string): Promise<NotificationModel[]>;
}
