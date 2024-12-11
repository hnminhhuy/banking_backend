import { BaseEntity } from 'src/common/entitites/base.entity';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import { UserModel } from 'src/modules/user/core/models/user.model';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  email: string;

  @Column('username')
  username: string;

  @Column()
  password: string;

  @Column('is_active')
  isActive: boolean;

  @Column('full_name')
  fullName: string;

  @Column()
  role: UserRole;

  constructor(model: Partial<UserModel>) {
    super();
    Object.assign(this, model);
  }
}
