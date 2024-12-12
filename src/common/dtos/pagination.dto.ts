import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { parseBoolean } from '../helpers/parse_boolean';

export class PaginationDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit!: number;

  @ApiProperty()
  @Transform((value: any) => parseBoolean(value.obj?.need_total_count, false))
  @IsBoolean()
  needTotalCount!: boolean;

  @ApiProperty()
  @Transform((value: any) => parseBoolean(value.obj?.only_count, false))
  @IsBoolean()
  onlyCount!: boolean;
}
