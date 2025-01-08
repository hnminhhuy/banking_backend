import { PageResponseModel } from 'src/common/models/page_response.model';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { BankModel } from 'src/modules/bank/core/models/bank.model';

export class BankPageModel extends PickType(BankModel, [
  'id',
  'code',
  'name',
  'shortName',
  'createdAt',
  'updatedAt',
]) {}

export class CustomerBankPageResponseModel extends PageResponseModel<BankPageModel> {
  @ApiProperty({
    description: 'The list of data for the page.',
    isArray: true,
    type: BankPageModel,
  })
  @IsArray()
  @Type(() => BankPageModel)
  data: BankPageModel[];
}
