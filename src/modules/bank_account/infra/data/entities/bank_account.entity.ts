import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  BankAccountModel,
  BankAccountParams,
} from '../../../core/models/bank_account.model';
import { UserEntity } from '../../../../user/infra/data/entities/user.entity';
import { UserModel } from '../../../../user/core/models/user.model';
import { ApiProperty } from '@nestjs/swagger';

@Entity('bank_accounts')
export class BankAccountEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'bank_id', type: 'uuid' })
  bankId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column()
  balance!: number;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  /** Relations */
  @OneToOne(() => UserEntity, (user) => user.bankAccount)
  @ApiProperty({ type: () => UserEntity })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  constructor(model: Partial<BankAccountModel>) {
    Object.assign(this, model);
  }
}
