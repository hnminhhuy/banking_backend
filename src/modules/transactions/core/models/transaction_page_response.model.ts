import { PageResponseModel } from 'src/common/models/page_response.model';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionModel } from './transaction.model';
import { TransactionCategory } from '../enums/transaction_category';

export class TransactionPageModel extends PickType(TransactionModel, [
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

  @ApiProperty({
    description: 'Information of the related user for the transaction.',
    type: Object,
    example: {
      name: 'string',
      bankAccountId: '03330001',
      bankName: 'National Heritage Bank',
    },
  })
  relatedUser: {
    name: string;
    bankAccountId: string;
    bankName: string;
  };
}

export class TransactionPageResponseModel extends PageResponseModel<TransactionPageModel> {
  @ApiProperty({
    description: 'The list of data for the page.',
    isArray: true,
    type: TransactionPageModel,
  })
  @IsArray()
  @Type(() => TransactionPageModel)
  data: TransactionPageModel[];
}
