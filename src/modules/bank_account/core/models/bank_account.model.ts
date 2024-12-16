import { ApiProperty } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from '../../../../common/models';

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

  constructor(partial: Partial<BankAccountModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
