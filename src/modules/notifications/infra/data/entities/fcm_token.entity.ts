import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../../../common/entitites';

@Entity('fcm_tokens')
export class FcmTokenEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'text' })
  token: string;

  constructor(partial: Partial<FcmTokenEntity>) {
    super();
    Object.assign(this, partial);
  }
}
