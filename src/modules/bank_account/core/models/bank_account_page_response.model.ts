import { PageResponseModel } from 'src/common/models/page_response.model';
import { BankAccountModel } from './bank_account.model';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// Sử dụng PickType để chọn các trường cần thiết từ BankAccountModel
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
    type: BankAccountPageModel, // Chỉ định kiểu dữ liệu là BankAccountPageModel
  })
  @IsArray()
  @Type(() => BankAccountPageModel) // Đảm bảo dữ liệu được chuyển thành BankAccountPageModel
  data: BankAccountPageModel[];
}
