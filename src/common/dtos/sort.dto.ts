import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SORT_DIRECTION } from '../enums';

export class SortParamsDto {
  @ApiProperty()
  @IsString()
  sort!: string;

  @ApiProperty()
  @IsEnum(SORT_DIRECTION)
  @Transform(({ value }) => value?.toUpperCase().trim())
  direction!: SORT_DIRECTION;
}
