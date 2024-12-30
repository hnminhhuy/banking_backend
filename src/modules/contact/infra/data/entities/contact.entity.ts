import { BaseEntity } from 'src/common/entitites';
import { BankEntity } from 'src/modules/bank/infra/data/entities/bank.entity';
import { ContactModel } from 'src/modules/contact/core/models/contact.model';
import { UserEntity } from 'src/modules/user/infra/data/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('contacts')
export class ContactEntity extends BaseEntity {
  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'bank_id' })
  bankId!: string;

  @Column({ name: 'beneficiary_id' })
  beneficiaryId!: string;

  @Column({ name: 'beneficiary_name' })
  beneficiaryName!: string;

  @Column()
  nickname?: string;

  // Foreign key relationship to UserEntity
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Join column for userId
  user!: UserEntity;

  // Foreign key relationship to BankEntity
  @ManyToOne(() => BankEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bank_id' }) // Join column for bankId
  bank!: BankEntity;

  constructor(model: Partial<ContactModel>) {
    super();
    Object.assign(this, model);
  }
}
