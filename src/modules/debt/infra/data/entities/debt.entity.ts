import { BaseEntity } from 'src/common/entitites/base.entity';
import { DebtStatus } from 'src/modules/debt/core/enum/debt_status';
import { DebtModel } from 'src/modules/debt/core/models/debt.model';
import { Column, Entity } from 'typeorm';

@Entity('debts')
export class DebtEntity extends BaseEntity {
  @Column({ name: 'reminder_id' })
  reminderId: string;

  @Column({ name: 'debtor_id' })
  debtorId: string;

  @Column()
  amount: number;

  @Column()
  status: DebtStatus;

  @Column()
  message: string;

  constructor(model: Partial<DebtModel>) {
    super();
    Object.assign(this, model);
  }
}
