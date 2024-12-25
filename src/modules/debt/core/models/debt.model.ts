import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from 'src/common/models';
import { DebtStatus } from '../enum/debt_status';

export interface DebtModelParams extends BaseModelParams {
  id?: string;
  reminderId?: string;
  debtorId: string;
  amount: number;
  status?: DebtStatus;
  message: string | undefined;
}

export class DebtModel extends BaseModel {
  @ApiProperty()
  public readonly reminderId: string;

  @ApiProperty()
  public readonly debtorId: string;

  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly status: DebtStatus;

  @ApiPropertyOptional()
  message: string | undefined;

  constructor(partial: Partial<DebtModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
