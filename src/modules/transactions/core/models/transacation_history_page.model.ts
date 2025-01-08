import { PageResponseModel } from 'src/common/models/page_response.model';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionModel } from './transaction.model';
import { TransactionCategory } from '../enums/transaction_category';

export class TransactionByUserHistoryModel extends PickType(TransactionModel, [
  'id',
  'status',
  'amount',
  'message',
]) {
  @ApiProperty({
    description: 'The date when the transaction was completed.',
    type: String,
    example: '2025-01-07T14:44:55.430Z',
  })
  date: Date;

  @ApiProperty({
    description: 'The category of the transaction.',
    example: 'debt',
  })
  category: TransactionCategory;
}

export class TransactionByUserHistoryPageModel extends PageResponseModel<TransactionByUserHistoryModel> {
  @ApiProperty({
    description: 'The list of data for the page.',
    isArray: true,
    type: TransactionByUserHistoryModel,
  })
  @IsArray()
  @Type(() => TransactionByUserHistoryModel)
  data: TransactionByUserHistoryModel[];
}

export class UserTransactionModel {
  @ApiProperty({
    description: 'The Bank ID of the customer',
    example: '21120001',
  })
  id: string;

  @ApiProperty({ description: 'The name of the customer', example: 'string' })
  name: string;

  @ApiProperty({
    description: 'The name of the bank of the customer',
    example: 'National Heritage Bank',
  })
  bankName: string;
}

export class TransactionHistoryModel extends PickType(TransactionModel, [
  'id',
  'createdAt',
  'updatedAt',
  'type',
  'status',
  'amount',
  'message',
  'transactionFee',
  'remitterPaidFee',
  'completedAt',
]) {
  @ApiProperty({
    type: UserTransactionModel,
    description: 'The remitter information',
  })
  remitter: UserTransactionModel;

  @ApiProperty({
    type: UserTransactionModel,
    description: 'The beneficiary information',
  })
  beneficiary: UserTransactionModel;
}

export class TransactionHistoryPageModel extends PageResponseModel<TransactionHistoryModel> {
  @ApiProperty({
    description: 'The list of data for the page.',
    isArray: true,
    type: TransactionHistoryModel,
  })
  @IsArray()
  @Type(() => TransactionHistoryModel)
  data: TransactionHistoryModel[];
}
