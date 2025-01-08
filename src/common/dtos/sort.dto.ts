import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SORT_DIRECTION } from '../enums';

export class SortParamsDto {
  @ApiProperty()
  @IsString()
  @ApiProperty({
    description: 'The field by which to sort',
    example: 'createdAt', // Placeholder ví dụ
  })
  sort!: string;

  @ApiProperty()
  @IsEnum(SORT_DIRECTION)
  @Transform(({ value }) => value?.toUpperCase().trim())
  @ApiProperty({
    enum: ['ASC', 'DESC'],
  })
  direction!: SORT_DIRECTION;
}
