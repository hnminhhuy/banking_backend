import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';
import { SortParamsDto } from '../../../../common/dtos/sort.dto';

export class ListBankDto extends IntersectionType(
  PartialType(PaginationDto),
  PartialType(SortParamsDto),
) {}
