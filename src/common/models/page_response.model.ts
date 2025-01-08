import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject } from 'class-validator';
import { PageParams } from './page_params.model';
import { Type } from 'class-transformer';

// Generic page response model
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
    type: PageParams,
  })
  @IsObject()
  metadata: PageParams;
}
