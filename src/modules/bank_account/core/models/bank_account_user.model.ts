import { ApiProperty } from '@nestjs/swagger';

export class BankAccountUserModel {
  @ApiProperty()
  bankId!: string;

  @ApiProperty()
  fullname!: string;

  constructor(partial: Partial<BankAccountUserModel>) {
    Object.assign(this, partial);
  }
}
