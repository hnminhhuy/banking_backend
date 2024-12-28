import { ApiProperty } from '@nestjs/swagger';

export class SortParams<T> {
  @ApiProperty({ description: 'The field by which to sort' })
  public readonly sort: T;

  @ApiProperty({
    description: 'Sort order, either ASC or DESC',
    enum: ['ASC', 'DESC'],
  })
  public readonly direction: 'ASC' | 'DESC';

  constructor(sort: T | undefined, direction: string | undefined) {
    this.sort = sort;
    this.direction = <'ASC' | 'DESC'>direction?.toUpperCase() ?? 'ASC';
  }
}
