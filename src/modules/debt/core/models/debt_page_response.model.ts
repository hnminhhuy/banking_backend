import { PageResponseModel } from 'src/common/models/page_response.model';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { DebtModel } from './debt.model';

export class DebtPageModel extends PickType(DebtModel, [
  'id',
  'createdAt',
  'updatedAt',
  'reminderId',
  'debtorId',
  'amount',
  'status',
  'message',
]) {}

export class DebtPageResponseModel extends PageResponseModel<DebtPageModel> {
  @ApiProperty({
    description: 'The list of data for the page.',
    isArray: true,
    type: DebtPageModel,
  })
  @IsArray()
  @Type(() => DebtPageModel)
  data: DebtPageModel[];
}
