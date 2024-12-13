import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { parseISO } from 'date-fns';

export class DateParamsDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => value && parseISO(value))
  @IsDate()
  from?: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value && parseISO(value))
  @IsDate()
  to?: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  column?: string;
}
