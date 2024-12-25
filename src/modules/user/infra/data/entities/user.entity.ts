import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entitites/base.entity';
import { BankAccountEntity } from 'src/modules/bank_account/infra/data/entities/bank_account.entity';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import { UserModel } from 'src/modules/user/core/models/user.model';
import { Column, Entity, OneToOne } from 'typeorm';

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
  @ApiProperty({ type: () => BankAccountEntity })
  bankAccount?: BankAccountEntity;

  constructor(model: Partial<UserModel>) {
    super();
    Object.assign(this, model);
  }
}
