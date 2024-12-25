import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsDefined, IsIn, IsUUID } from 'class-validator';
import { PaginationDto, SortParamsDto } from 'src/common/dtos';

export class ListContactDto extends IntersectionType(
  PartialType(PaginationDto),
  PartialType(SortParamsDto),
) {}
