import { ApiProperty } from '@nestjs/swagger';

class TransactionChartDataModel {
  @ApiProperty({
    description: 'The time of the transaction',
    example: '6/1/2025',
  })
  time: string;

  @ApiProperty({ description: 'The value of the transaction', example: 0 })
  value: number;

  @ApiProperty({
    description: 'The type of the transaction',
    example: 'string',
  })
  type: string;
}

class ByCategoryModel {
  @ApiProperty({
    description: 'Total incoming transactions by time',
    type: [TransactionChartDataModel],
  })
  totalIncoming: TransactionChartDataModel[];

  @ApiProperty({
    description: 'Total outgoing transactions by time',
    type: [TransactionChartDataModel],
  })
  totalOutcoming: TransactionChartDataModel[];
}

class ChartDataModel {
  @ApiProperty({
    description: 'The total transaction data',
    type: [TransactionChartDataModel],
  })
  totalTransactionData: TransactionChartDataModel[];

  @ApiProperty({
    description: 'Transactions categorized by type (incoming and outgoing)',
    type: ByCategoryModel,
  })
  byCategory: ByCategoryModel;
}

export class ChartResponseModel {
  @ApiProperty({
    description: 'Response data containing transaction details',
    type: ChartDataModel,
  })
  data: ChartDataModel;
}
