import { ApiProperty } from '@nestjs/swagger';

export interface BaseModelParams {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class BaseModel {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;

  constructor({ id, createdAt, updatedAt }: BaseModelParams) {
    this.id = id;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}
