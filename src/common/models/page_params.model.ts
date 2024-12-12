import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageParams {
  @ApiPropertyOptional({ description: 'Page number, default is 1' })
  public readonly page: number;

  @ApiPropertyOptional({
    description: 'Number of items per page, default is 10',
  })
  public readonly limit: number;

  @ApiPropertyOptional({
    description: 'Indicates whether to include total count, default is true',
  })
  public readonly needTotalCount: boolean;

  @ApiPropertyOptional({
    description: 'Indicates whether to count only, default is false',
  })
  public readonly onlyCount: boolean;

  constructor(
    page: number | undefined,
    limit: number | undefined,
    needTotalCount: boolean | undefined,
    onlyCount: boolean | undefined,
  ) {
    this.page = page ?? 1;
    this.limit = limit ?? 10;
    this.needTotalCount = needTotalCount == undefined ? true : needTotalCount;
    this.onlyCount = onlyCount == undefined ? false : onlyCount;
  }
}
