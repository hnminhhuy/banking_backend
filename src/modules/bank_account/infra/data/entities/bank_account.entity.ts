import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BankAccountModel } from '../../../core/models/bank_account.model';
import { UserEntity } from 'src/modules/user/infra/data/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { DebtEntity } from 'src/modules/debt/infra/data/entities/debt.entity';

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

  @OneToMany(() => DebtEntity, (debt) => debt.reminderAccount)
  reminderDebts: DebtEntity[];

  @OneToMany(() => DebtEntity, (debt) => debt.debtorAccount)
  debtorDebts: DebtEntity[];

  constructor(model: Partial<BankAccountModel>) {
    Object.assign(this, model);
  }
}
