import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  DateParamsDto,
  PaginationDto,
  SortParamsDto,
} from '../../../../common/dtos';
import { TransactionDto } from './transaction.dto';
import { IsOptional, IsString } from 'class-validator';
import { TransactionCategory } from '../../core/enums/transaction_category';

export class ListTransactionDto extends IntersectionType(
  PartialType(PaginationDto),
  PartialType(SortParamsDto),
  PartialType(PickType(TransactionDto, ['status'])),
) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: TransactionCategory;
}

export class ReconcileTransactionDto extends IntersectionType(
  PartialType(PaginationDto),
  PartialType(SortParamsDto),
  PartialType(DateParamsDto),
  PartialType(PickType(TransactionDto, ['status'])),
) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankId?: string;
}

export class StatisticTransactionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankId?: string;
}
