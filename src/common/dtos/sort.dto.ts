import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SortOrder } from '../enums';

export class SortParamsDto {
  @ApiProperty()
  @IsString()
  sort!: string;

  @ApiProperty()
  @IsEnum(SortOrder)
  @Transform(({ value }) => value?.toUpperCase().trim())
  direction!: SortOrder;
}
