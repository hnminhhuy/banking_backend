import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../../common/entitites';
import { BankModel } from '../../../core/models/bank.model';

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

  constructor(model: Partial<BankModel>) {
    super();
    Object.assign(this, model);
  }
}
