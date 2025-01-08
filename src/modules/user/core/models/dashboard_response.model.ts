import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/swagger';
import { TransactionCategory } from 'src/modules/transactions/core/enums/transaction_category';
import { TransactionModel } from 'src/modules/transactions/core/models/transaction.model';

// Create a new model to combine the necessary fields from TransactionModel and relatedUser
class TransactionWithRelatedUser extends PickType(TransactionModel, [
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

export class DashboardInfoResponseModel {
  @ApiProperty({
    type: [TransactionWithRelatedUser],
    description: 'List of recent transactions with related user details.',
  })
  recentTransactions: TransactionWithRelatedUser[];

  @ApiProperty({
    example: {
      totalDebtCreatedCurrentMonth: 5,
      totalPaidCurrentMonth: 50000,
      totalBePaidCurrentMonth: 250000,
      debtCreationRate: -16.67,
      paidRate: -50,
      bePaidRate: -3.85,
    },
    description: 'Debt count statistics for the current month.',
  })
  debtCount: {
    totalDebtCreatedCurrentMonth: number;
    totalPaidCurrentMonth: number;
    totalBePaidCurrentMonth: number;
    debtCreationRate: number;
    paidRate: number;
    bePaidRate: number;
  };
}
