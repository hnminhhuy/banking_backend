import { ConfigModel } from 'src/modules/config/core/models/config.model';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'configs' })
export class ConfigEntity {
  @PrimaryColumn()
  public readonly id!: number;

  @Column()
  public readonly key!: string;

  @Column()
  public readonly value!: string;

  @Column()
  public readonly type!: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  public readonly createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  public readonly updatedAt: Date;

  constructor(model: Partial<ConfigModel>) {
    Object.assign(this, model);
  }
}
