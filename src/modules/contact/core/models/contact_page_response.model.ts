import { PageResponseModel } from 'src/common/models/page_response.model';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ContactModel } from './contact.model';

export class ContactPageModel extends PickType(ContactModel, [
  'id',
  'createdAt',
  'updatedAt',
  'userId',
  'bankId',
  'beneficiaryId',
  'beneficiaryName',
  'nickname',
]) {}

export class ContactPageResponseModel extends PageResponseModel<ContactPageModel> {
  @ApiProperty({
    description: 'The list of data for the page.',
    isArray: true,
    type: ContactPageModel,
  })
  @IsArray()
  @Type(() => ContactPageModel)
  data: ContactPageModel[];
}
