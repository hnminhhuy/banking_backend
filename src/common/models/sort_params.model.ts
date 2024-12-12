import { ApiProperty } from '@nestjs/swagger';

export class SortParams<T> {
  @ApiProperty({ description: 'The field by which to sort' })
  public readonly sort: T;

  @ApiProperty({
    description: 'Sort order, either ASC or DESC',
    enum: ['ASC', 'DESC'],
  })
  public readonly dir: 'ASC' | 'DESC';

  constructor(sort: T, dir: string | undefined) {
    this.sort = sort;
    this.dir = <'ASC' | 'DESC'>dir?.toUpperCase() ?? 'ASC';
  }
}
