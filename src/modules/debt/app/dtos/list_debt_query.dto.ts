import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { DebtStatus } from '../../core/enum/debt_status';

export class ListDebtQueryDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  reminderId?: string;

  @ApiPropertyOptional()
  debtorId?: string;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  status?: DebtStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty()
  @IsDateString()
  public createdAt?: Date;

  @ApiProperty()
  @IsDateString()
  public updatedAt?: Date;
}
