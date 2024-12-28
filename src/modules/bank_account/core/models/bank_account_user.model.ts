import { ApiProperty } from '@nestjs/swagger';

export class BankAccountUserModel {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fullname!: string;

  constructor(partial: Partial<BankAccountUserModel>) {
    Object.assign(this, partial);
  }
}
