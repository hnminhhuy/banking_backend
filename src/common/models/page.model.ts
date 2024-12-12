import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Page<T> {
  @ApiProperty({ description: 'The current page number (starting from 1)' })
  public readonly page: number;

  @ApiPropertyOptional({
    description:
      'The total number of items available across all pages, if available',
  })
  public readonly totalCount: number | undefined;

  @ApiProperty({ description: 'The data for the current page' })
  public readonly data: T[];

  constructor(page: number, totalCount: number | undefined, data: T[]) {
    this.page = page ?? 1; // Default to page 1 if not provided
    this.totalCount = totalCount; // Default to undefined if not provided
    this.data = data ?? []; // Default to an empty array if not provided
  }
}
