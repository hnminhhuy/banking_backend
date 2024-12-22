import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID, Length } from 'class-validator';

export class OtpDto {
  @ApiProperty()
  @IsUUID()
  public userId: string;

  @ApiProperty()
  @IsDefined()
  @Length(6, 6)
  public otp: string;
}
