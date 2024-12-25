import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import { PaginationDto, SortParamsDto } from 'src/common/dtos';

export class ListDebtDto extends IntersectionType(
  PartialType(PaginationDto),
  PartialType(SortParamsDto),
) {
  @ApiPropertyOptional()
  reminderId?: string;
}
