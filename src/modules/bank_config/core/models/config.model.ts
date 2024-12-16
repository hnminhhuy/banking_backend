import { ApiProperty } from '@nestjs/swagger';
import { ConfigType } from '../enum/config_type';

export class ConfigModel {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly key: string;

  @ApiProperty()
  public readonly value: string;

  @ApiProperty()
  public readonly type: string;

  @ApiProperty()
  public readonly createdAt: Date;

  @ApiProperty()
  public readonly updatedAt: Date;

  constructor(params: Partial<ConfigModel>) {
    Object.assign(this, params);
  }

  public getValue(): unknown {
    switch (this.type) {
      case ConfigType.STRING:
        return this.value;
      case ConfigType.NUMBER:
        return Number(this.value);
      case ConfigType.BOOLEAN:
        return this.value === 'true';
      case ConfigType.DATE:
        return new Date(this.value);
      case ConfigType.JSON:
        return JSON.parse(this.value);
      default:
        throw new Error(`Unsupported config type: ${this.type}`);
    }
  }
}
