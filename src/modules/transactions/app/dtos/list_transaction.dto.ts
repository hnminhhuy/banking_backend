import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { PaginationDto, SortParamsDto } from '../../../../common/dtos';
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
