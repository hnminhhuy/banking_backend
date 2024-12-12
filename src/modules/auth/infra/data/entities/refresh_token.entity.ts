import { AuthProvider } from 'src/modules/auth/core/enums/auth.provider';
import { RefreshTokenModel } from 'src/modules/auth/core/models/refresh_token.model';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'refresh_token', type: 'varchar' })
  refreshToken!: string;

  @Column({ name: 'auth_id', type: 'uuid', nullable: true })
  authId?: string;

  @Column()
  provider!: AuthProvider;

  @Column({ name: 'issued_at', type: 'timestamp' })
  issuedAt!: Date;

  constructor(model: Partial<RefreshTokenModel>) {
    Object.assign(this, model);
  }
}
