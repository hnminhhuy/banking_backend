import { BaseEntity } from 'src/common/entitites/base.entity';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import {
  UserModel,
  UserModelParams,
} from 'src/modules/user/core/models/user.model';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BankAccountEntity } from '../../../../bank_account/infra/data/entities/bank_account.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ name: 'created_by' })
  createdBy: string | undefined;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ name: 'is_blocked' })
  isBlocked: boolean;

  @Column({ name: 'fullname' })
  fullName: string;

  @Column()
  role: UserRole;

  /** Relations */
  @OneToOne(() => BankAccountEntity, (bankAccount) => bankAccount.user)
  bankAccount?: BankAccountEntity;

  constructor(model: Partial<UserModel>) {
    super();
    Object.assign(this, model);
  }

  public toModel(): UserModel {
    return new UserModel({} as UserModelParams);
  }
}
