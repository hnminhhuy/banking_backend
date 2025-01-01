import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../../common/entitites';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  body: string;

  @Column({ type: 'timestamp', name: 'reat_at' })
  readAt!: Date;

  constructor(partial: Partial<NotificationEntity>) {
    super();
    Object.assign(this, partial);
  }
}
