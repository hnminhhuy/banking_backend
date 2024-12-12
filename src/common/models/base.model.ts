import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export interface BaseModelParams {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class BaseModel {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly createdAt: Date;

  @ApiProperty()
  public readonly updatedAt: Date;

  constructor({ id, createdAt, updatedAt }: BaseModelParams) {
    this.id = id || uuidv4();
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}
