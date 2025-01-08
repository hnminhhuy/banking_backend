import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel, BaseModelParams } from 'src/common/models';
import { DebtStatus } from '../enum/debt_status';
import { BankAccountModel } from '../../../bank_account/core/models/bank_account.model';
import { BankAccountEntity } from '../../../bank_account/infra/data/entities/bank_account.entity';

export interface DebtModelParams extends BaseModelParams {
  id?: string;
  reminderId?: string;
  debtorId: string;
  amount: number;
  status?: DebtStatus;
  message: string | undefined;
  reminderFullName?: string;
  debtorFullName?: string;
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

  @ApiPropertyOptional()
  public reminderFullName?: string | undefined;

  @ApiPropertyOptional()
  public debtorFullName?: string | undefined;

  @ApiPropertyOptional()
  public reminderAccount: BankAccountModel | BankAccountEntity | undefined;

  constructor(partial: Partial<DebtModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class CancelDebtResponseModel {
  @ApiProperty({ description: 'The ID of the debt' })
  id: string;

  @ApiProperty({ description: 'The current status of the debt', example: 200 })
  status: number;

  @ApiProperty({
    description: 'A message describing the result of the cancellation',
    example: 'Debt successfully canceled',
  })
  message: string;
}
