import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { DebtStatus } from '../../core/enum/debt_status';
import { DebtCategory } from '../../core/enum/debt_category';

export class ListDebtQueryDto {
  @ApiPropertyOptional()
  category?: DebtCategory;

  @ApiPropertyOptional()
  includeUser?: boolean;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  status?: DebtStatus;

  @ApiProperty()
  @IsDateString()
  public createdAt?: Date;

  @ApiProperty()
  @IsDateString()
  public updatedAt?: Date;
}
