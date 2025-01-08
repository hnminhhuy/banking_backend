import { ApiProperty } from '@nestjs/swagger';
import { PageResponseModel } from 'src/common/models/page_response.model';
import { GetTransactionResponseModel } from './transaction.model';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class ReconcileModel extends PageResponseModel<GetTransactionResponseModel> {
  @ApiProperty({
    description: 'The list of data for the page.',
    isArray: true,
    type: GetTransactionResponseModel,
  })
  @IsArray()
  @Type(() => GetTransactionResponseModel)
  data: GetTransactionResponseModel[];
}
