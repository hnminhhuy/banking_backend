import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from '../../../../common/models';
import { TransactionType } from '../enums/transaction_type';
import { TransactionStatus } from '../enums/transaction_status';
import { BankModel } from '../../../bank/core/models/bank.model';
import { BankEntity } from '../../../bank/infra/data/entities/bank.entity';

export interface TransactionModelParams extends BaseModelParams {
  remitterId: string;
  remitterName: string;
  remitterBankId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryBankId: string;
  amount: number;
  message: string;
  type: TransactionType;
  status?: TransactionStatus;
  transactionFee: number;
  debtId?: string;
  remitterPaidFee: boolean;
}

export class TransactionModel extends BaseModel {
  @ApiProperty()
  public readonly remitterId: string;

  @ApiProperty()
  public readonly remitterName: string;

  @ApiProperty()
  public readonly remitterBankId: string;

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

  @ApiPropertyOptional()
  public readonly debtId: string | undefined;

  @ApiProperty()
  public readonly type: TransactionType;

  @ApiProperty()
  public readonly status: TransactionStatus;

  @ApiProperty()
  public readonly transactionFee: number;

  @ApiProperty()
  public readonly remitterPaidFee: boolean;

  @ApiPropertyOptional()
  public readonly completedAt: Date | undefined;

  @ApiPropertyOptional()
  public readonly remitterBank: BankModel | BankEntity | undefined;

  @ApiPropertyOptional()
  public readonly beneficiaryBank: BankModel | BankEntity | undefined;

  constructor(partial: Partial<TransactionModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class DebtTransactionResponseModel extends PickType(TransactionModel, [
  'id',
  'createdAt',
  'updatedAt',
  'amount',
  'remitterId',
  'type',
  'transactionFee',
  'beneficiaryId',
  'remitterPaidFee',
  'message',
  'beneficiaryName',
  'remitterBankId',
  'remitterName',
  'debtId',
  'status',
]) {}

export class TransactionResponseModel extends PickType(TransactionModel, [
  'id',
  'createdAt',
  'updatedAt',
  'amount',
  'remitterId',
  'type',
  'transactionFee',
  'beneficiaryId',
  'beneficiaryBankId',
  'remitterPaidFee',
  'message',
  'beneficiaryName',
  'remitterBankId',
  'remitterName',
  'status',
]) {}

export class GetTransactionResponseModel extends PickType(TransactionModel, [
  'id',
  'createdAt',
  'updatedAt',
  'amount',
  'remitterId',
  'type',
  'debtId',
  'transactionFee',
  'beneficiaryId',
  'beneficiaryBankId',
  'remitterPaidFee',
  'message',
  'beneficiaryName',
  'remitterBankId',
  'remitterName',
  'status',
  'completedAt',
]) {}
