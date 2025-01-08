import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import { DebtStatus } from '../../core/enum/debt_status';
import { DebtCategory } from '../../core/enum/debt_category';

export class ListDebtQueryDto {
  @ApiPropertyOptional({ enum: DebtCategory })
  category?: DebtCategory;

  @ApiPropertyOptional()
  includeUser?: boolean;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional({ enum: DebtStatus })
  status?: DebtStatus;

  @ApiProperty()
  @IsDateString()
  public createdAt?: Date;

  @ApiProperty()
  @IsDateString()
  public updatedAt?: Date;
}
