import { ApiProperty } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from '../../../../common/models';
import { TransactionType } from '../enums/transaction_type';
import { TransactionStatus } from '../enums/transaction_status';

export interface TransactionModelParams extends BaseModelParams {
  remitterId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryBankId: string;
  amount: number;
  message: string;
  type: TransactionType;
  status: TransactionStatus;
  transactionFee: number;
  remitterPaidFee: boolean;
}

export class TransactionModel extends BaseModel {
  @ApiProperty()
  public readonly remitterId: string;

  @ApiProperty()
  public readonly beneficiaryId: string;

  @ApiProperty()
  public readonly beneficiaryName: string;

  @ApiProperty()
  public readonly beneficiaryBankId: string;

  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly message: string;

  @ApiProperty()
  public readonly type: TransactionType;

  @ApiProperty()
  public readonly status: TransactionStatus;

  @ApiProperty()
  public readonly transactionFee: number;

  @ApiProperty()
  public readonly remitterPaidFee: boolean;

  constructor(partial: Partial<TransactionModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
