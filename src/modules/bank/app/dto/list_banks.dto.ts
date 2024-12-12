import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { BankDto } from './bank.dto';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';
import { SortParamsDto } from '../../../../common/dtos/sort.dto';

export class ListBankDto extends IntersectionType(
  PartialType(PaginationDto),
  PartialType(SortParamsDto),
) {}
