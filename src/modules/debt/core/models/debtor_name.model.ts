import { ApiProperty } from '@nestjs/swagger';

export class DebtorNameModel {
  @ApiProperty()
  public readonly debtorId: string;

  @ApiProperty()
  public debtorFullName: string;

  constructor(partial: Partial<DebtorNameModel>) {
    Object.assign(this, partial);
  }
}
