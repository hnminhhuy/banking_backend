import { ApiProperty } from '@nestjs/swagger';

export class TransactionStatisticModel {
  @ApiProperty({
    description: 'The total amount of outgoing transactions',
    example: 3669075,
  })
  outcomingAmount: number;

  @ApiProperty({
    description: 'The total amount of incoming transactions',
    example: 3658075,
  })
  incomingAmount: number;

  @ApiProperty({
    description: 'The total count of transactions',
    example: 23,
  })
  transactionCount: number;
}
