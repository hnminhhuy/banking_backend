import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseModel {
  @ApiProperty({ name: 'id' })
  id: string;

  @ApiProperty({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  updatedAt: Date;
}
