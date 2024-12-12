import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BankAccountModel } from '../../../core/models/bank_account.model';

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

  constructor(model: Partial<BankAccountModel>) {
    Object.assign(this, model);
  }
}
