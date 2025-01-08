import { PageResponseModel } from 'src/common/models/page_response.model';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UserMeModel, UserModel } from './user.model';
import { BankAccountModel } from 'src/modules/bank_account/core/models/bank_account.model';
import { BankAccountPageModel } from 'src/modules/bank_account/core/models/bank_account_page_response.model';

export class UserPageModel extends PickType(UserModel, [
  'id',
  'createdAt',
  'updatedAt',
  'email',
  'username',
  'isBlocked',
  'fullName',
  'role',
]) {}

export class UserPageResponseModel extends PageResponseModel<UserPageModel> {
  @ApiProperty({
    description: 'The list of data for the page.',
    isArray: true,
    type: UserPageModel,
  })
  @IsArray()
  @Type(() => UserPageModel)
  data: UserPageModel[];
}

export class UserEmployeePageModel extends PickType(UserModel, [
  'id',
  'createdAt',
  'updatedAt',
  'email',
  'username',
  'isBlocked',
  'fullName',
  'role',
]) {
  @ApiProperty()
  bankAccount: BankAccountPageModel;

  @ApiProperty()
  createdByEmployee: UserMeModel;
}

export class UserEmployeePageResponseModel extends PageResponseModel<UserEmployeePageModel> {
  @ApiProperty({
    description: 'The list of data for the page.',
    isArray: true,
    type: UserEmployeePageModel,
  })
  @IsArray()
  @Type(() => UserEmployeePageModel)
  data: UserEmployeePageModel[];
}
