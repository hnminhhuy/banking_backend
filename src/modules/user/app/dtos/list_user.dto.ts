import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationDto, SortParamsDto } from 'src/common/dtos';

export class ListUserDto extends IntersectionType(
  PartialType(PaginationDto),
  PartialType(SortParamsDto),
) {}
