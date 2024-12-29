import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetUserTransactionDto {
  @IsUUID()
  @ApiProperty()
  userId!: string;
}
