import { ApiProperty } from '@nestjs/swagger';

export interface BaseModelParams {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class BaseModel {
  @ApiProperty({ description: 'Unique identifier' })
  public id: string;

  @ApiProperty({ description: 'Timestamp of when the record was created' })
  public createdAt: Date;

  @ApiProperty({ description: 'Timestamp of when the record was last updated' })
  public updatedAt: Date;

  constructor({ id, createdAt, updatedAt }: BaseModelParams) {
    this.id = id;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}
