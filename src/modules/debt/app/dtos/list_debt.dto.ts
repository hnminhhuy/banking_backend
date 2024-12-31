import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationDto, SortParamsDto } from 'src/common/dtos';
import { ListDebtQueryDto } from './list_debt_query.dto';

export class ListDebtDto extends IntersectionType(
  PartialType(PaginationDto),
  PartialType(SortParamsDto),
  PartialType(ListDebtQueryDto),
) {}
