import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/dtos';
import { IsString, Length } from 'class-validator';

export class BankDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @Length(3, 10)
  code!: string;

  @ApiProperty()
  @IsString()
  @Length(3, 50)
  name!: string;

  @ApiProperty()
  @IsString()
  @Length(3, 20)
  shortName!: string;

  @ApiProperty()
  @IsString()
  @Length(10, 4096)
  publicKey!: string;

  @ApiProperty()
  @IsString()
  @Length(5, 255)
  logoUrl!: string;

  @ApiProperty()
  @IsString()
  algorithm!: string;
}
