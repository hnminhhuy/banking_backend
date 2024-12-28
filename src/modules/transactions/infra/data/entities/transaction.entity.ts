import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TransactionType } from '../../../core/enums/transaction_type';
import { TransactionStatus } from '../../../core/enums/transaction_status';
import { TransactionModel } from '../../../core/models/transaction.model';
import { BaseEntity } from '../../../../../common/entitites';
import { BankEntity } from '../../../../bank/infra/data/entities/bank.entity';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @Column({ name: 'remitter_id' })
  remitterId!: string;

  @Column({ name: 'remitter_name' })
  remitterName!: string;

  @Column({ name: 'remitter_bank_id' })
  remitterBankId!: string;

  @Column({ name: 'beneficiary_id' })
  beneficiaryId!: string;

  @Column({ name: 'beneficiary_name' })
  beneficiaryName!: string;

  @Column({ name: 'beneficiary_bank_id' })
  beneficiaryBankId!: string;

  @Column()
  message!: string;

  @Column()
  amount!: number;

  @Column()
  type!: TransactionType;

  @Column({ name: 'debt_id', type: 'uuid' })
  debtId!: string;

  @Column()
  status!: TransactionStatus;

  @Column({ name: 'transaction_fee' })
  transactionFee!: number;

  @Column({ name: 'remitter_paid_fee' })
  remitterPaidFee: boolean;

  @Column({ name: 'completed_at', type: 'timestamp' })
  completedAt?: Date;

  /** Relations */
  @ManyToOne(() => BankEntity)
  @JoinColumn({ name: 'remitter_bank_id' })
  remitterBank?: BankEntity;

  @ManyToOne(() => BankEntity)
  @JoinColumn({ name: 'beneficiary_bank_id' })
  beneficiaryBank?: BankEntity;

  constructor(partial: Partial<TransactionModel>) {
    super();
    Object.assign(this, partial);
  }
}
