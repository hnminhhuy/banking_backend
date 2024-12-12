import { ApiProperty } from '@nestjs/swagger';

export interface SortParamsModelParams<T> {
  sort: T;
  dir: 'ASC' | 'DESC';
}

export class SortParamsModel<T> {
  @ApiProperty({ description: 'The field by which to sort' })
  public readonly sort: T;

  @ApiProperty({
    description: 'Sort order, either ASC or DESC',
    enum: ['ASC', 'DESC'],
  })
  public readonly dir: 'ASC' | 'DESC';

  constructor({ sort, dir }: SortParamsModelParams<T>) {
    this.sort = sort;
    this.dir = dir;
  }
}
