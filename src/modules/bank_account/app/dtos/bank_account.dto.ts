import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID, Length, Max, Min } from 'class-validator';

export class BankAccountDto {
  @ApiProperty()
  @IsString()
  @Length(8)
  id!: string;

  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  balance!: number;
}
