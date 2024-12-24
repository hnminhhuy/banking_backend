import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from 'src/common/models';
import { Status } from '../enum/status';

export interface DebtModelParams extends BaseModelParams {
  reminderId?: string;
  debtorId: string;
  amount: number;
  status?: Status;
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
  public readonly status: Status;

  @ApiPropertyOptional()
  message: string | undefined;

  constructor(partial: Partial<DebtModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
