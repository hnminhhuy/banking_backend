import { ApiProperty, PickType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { IsEnum } from 'class-validator';
import { TransactionCustomerChartMode } from '../../core/enums/transaction_customer_chart_mode';

export class GetTransactionDto extends PickType(TransactionDto, ['id']) {}

export class GetChartMode {
  @ApiProperty({
    enum: TransactionCustomerChartMode,
  })
  @IsEnum(TransactionCustomerChartMode)
  mode!: TransactionCustomerChartMode;
}
