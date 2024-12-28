import { BaseEntity } from 'src/common/entitites/base.entity';
import { BankAccountEntity } from 'src/modules/bank_account/infra/data/entities/bank_account.entity';
import { DebtStatus } from 'src/modules/debt/core/enum/debt_status';
import { DebtModel } from 'src/modules/debt/core/models/debt.model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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

  /** Relations */
  @ManyToOne(
    () => BankAccountEntity,
    (bankAccount) => bankAccount.reminderDebts,
  )
  @JoinColumn({ name: 'reminder_id' })
  reminderAccount: BankAccountEntity;

  @ManyToOne(() => BankAccountEntity, (bankAccount) => bankAccount.debtorDebts)
  @JoinColumn({ name: 'debtor_id' })
  debtorAccount: BankAccountEntity;

  constructor(model: Partial<DebtModel>) {
    super();
    Object.assign(this, model);
  }
}
