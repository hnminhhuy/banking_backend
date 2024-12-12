import { ApiPropertyOptional } from '@nestjs/swagger';

export interface DateFilterModelParams {
  from?: Date;
  to?: Date;
  column?: string;
}

export class DateFilterModel {
  @ApiPropertyOptional({ type: Date, description: 'Start date' })
  public readonly from: Date | undefined;

  @ApiPropertyOptional({ type: Date, description: 'End date' })
  public readonly to: Date | undefined;

  @ApiPropertyOptional({ description: 'Column name for filtering' })
  public readonly column: string | undefined;

  constructor({ from, to, column }: DateFilterModelParams) {
    this.from = from;
    this.to = to;
    this.column = column;
  }
}
