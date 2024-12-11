import { BaseEntity } from 'src/common/entitites';
import { UserModel } from 'src/modules/user/core/models/user.model';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ name: 'username', nullable: true })
  userName: string;

  @Column({ name: 'verified_email', default: false })
  verifiedEmail: boolean;

  @Column({ name: 'student_id', nullable: true })
  studentId: string;

  @Column({ name: 'additional_email', nullable: true, unique: true })
  additionalEmail: string;

  @Column({ unique: true, nullable: false })
  email: string;

  constructor(model: Partial<UserModel>) {
    super();
    Object.assign(this, model);
  }
}
