import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { parseISO } from 'date-fns';

export class DateParamsDto {
  @ApiProperty({
    description: 'The start date for filtering data',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @Transform(({ value }) => value && parseISO(value))
  @IsDate()
  from?: Date;

  @ApiProperty({
    description: 'The end date for filtering data',
    example: '2025-01-31T23:59:59.999Z',
  })
  @IsOptional()
  @Transform(({ value }) => value && parseISO(value))
  @IsDate()
  to?: Date;

  @ApiProperty({
    description: 'The column to filter data by',
    example: 'createdAt',
  })
  @IsString()
  @IsOptional()
  column?: string;
}
