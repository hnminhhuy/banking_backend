import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../../common/entitites';
import { BankModel } from '../../../core/models/bank.model';
import { ContactEntity } from 'src/modules/contact/infra/data/entities/contact.entity';

@Entity('banks')
export class BankEntity extends BaseEntity {
  @Column()
  code!: string;

  @Column()
  name!: string;

  @Column({ name: 'short_name' })
  shortName!: string;

  @Column({ type: 'text', name: 'public_key' })
  publicKey!: string;

  @Column({ name: 'logo_url' })
  logoUrl?: string;

  @Column()
  algorithm!: string;

  /** Relations */
  @OneToMany(() => ContactEntity, (contact) => contact.bank)
  contacts!: ContactEntity[];

  constructor(model: Partial<BankModel>) {
    super();
    Object.assign(this, model);
  }
}
