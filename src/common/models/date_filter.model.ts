import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

export class DateFilter {
  @ApiPropertyOptional({ type: Date, description: 'Start date' })
  public readonly from: Date | undefined;

  @ApiPropertyOptional({ type: Date, description: 'End date' })
  public readonly to: Date | undefined;

  @ApiPropertyOptional({ description: 'Column name for filtering' })
  public readonly column: string | undefined;

  constructor(
    from: Date | undefined,
    to: Date | undefined,
    column: string | undefined,
  ) {
    this.from = from;
    this.to = to;
    this.column = column;
  }

  public toFindCondition(): FindOperator<Date> | undefined {
    if (this.from && this.to) {
      return Between(this.from, this.to);
    } else if (this.from) {
      return MoreThanOrEqual(this.from);
    } else if (this.to) {
      return LessThanOrEqual(this.to);
    }
  }
}
