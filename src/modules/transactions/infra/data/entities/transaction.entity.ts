import { BaseEntity, Column, Entity } from 'typeorm';
import { TransactionType } from '../../../core/enums/transaction_type';
import { TransactionStatus } from '../../../core/enums/transaction_status';
import { TransactionModel } from '../../../core/models/transaction.model';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @Column({ name: 'remitter_id' })
  remitterId!: string;

  @Column({ name: 'beneficiary_id' })
  beneficiaryId!: string;

  @Column({ name: 'beneficiary_bank_id' })
  beneficiaryBankId!: string;

  @Column()
  message!: string;

  @Column()
  ammount!: number;

  @Column()
  type!: TransactionType;

  @Column()
  status!: TransactionStatus;

  @Column({ name: 'transaction_fee' })
  transactionFee!: number;

  @Column({ name: 'remitter_paid_fee' })
  remitterPairdFee: boolean;

  constructor(partial: Partial<TransactionModel>) {
    super();
    Object.assign(this, partial);
  }
}
