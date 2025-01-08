import { PageResponseModel } from 'src/common/models/page_response.model';
import { BankAccountModel } from './bank_account.model';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class BankAccountPageModel extends PickType(BankAccountModel, [
  'id',
  'createdAt',
  'updatedAt',
  'bankId',
  'userId',
  'balance',
]) {}

// Sử dụng BankAccountPageModel trong PageResponseModel
export class BankAccountPageResponseModel extends PageResponseModel<BankAccountPageModel> {
  @ApiProperty({
    description: 'The list of data for the page.',
    isArray: true,
    type: BankAccountPageModel,
  })
  @IsArray()
  @Type(() => BankAccountPageModel)
  data: BankAccountPageModel[];
}
