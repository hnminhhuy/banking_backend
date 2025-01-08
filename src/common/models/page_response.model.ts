import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject } from 'class-validator';
import { PageParams } from './page_params.model';
import { Type } from 'class-transformer';
class PaginationMetadata {
  @ApiProperty({
    description: 'The current page number (starting from 1)',
  })
  page: number;

  @ApiProperty({
    description: 'The total number of items available across all pages',
  })
  totalCount: number;
}

export class PageResponseModel<T> {
  @ApiProperty({
    description: 'The list of data for the page.',
    type: () => Object,
    isArray: true,
  })
  @IsArray()
  @Type(() => Object)
  data: T[];

  @ApiProperty({
    description: 'Pagination metadata.',
    type: PaginationMetadata,
  })
  @IsObject()
  metadata: PaginationMetadata;
}
