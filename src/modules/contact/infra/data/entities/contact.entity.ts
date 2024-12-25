import { BaseEntity } from 'src/common/entitites';
import { ContactModel } from 'src/modules/contact/core/models/contact.model';
import { Column, Entity } from 'typeorm';

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

  constructor(model: Partial<ContactModel>) {
    super();
    Object.assign(this, model);
  }
}
