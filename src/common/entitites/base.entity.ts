import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
