import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class BankAccountDto {
  @ApiProperty()
  @IsString()
  @Length(8)
  id!: string;

  @ApiProperty()
  @IsUUID()
  userId!: string;
}
