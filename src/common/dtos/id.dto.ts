import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

export class IdDto {
  @ApiProperty()
  @IsUUID()
  @IsDefined()
  public id: string;
}
