import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from '../../../../common/models';
import { UserModel } from 'src/modules/user/core/models/user.model';
import { UserEntity } from 'src/modules/user/infra/data/entities/user.entity';

export interface BankAccountParams extends BaseModelParams {
  id?: string;
  bankId: string;
  userId: string;
  balance: number;
}

export class BankAccountModel extends BaseModel {
  @ApiProperty()
  bankId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  balance!: number;

  @ApiPropertyOptional()
  public readonly user?: UserModel | undefined | UserEntity;

  constructor(partial: Partial<BankAccountModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
