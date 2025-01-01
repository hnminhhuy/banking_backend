import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FcmTokenDto {
  @ApiProperty()
  @IsString()
  token: string;
}
