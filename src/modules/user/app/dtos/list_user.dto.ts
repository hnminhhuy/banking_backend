import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsDefined, IsIn } from 'class-validator';
import { PaginationDto, SortParamsDto } from 'src/common/dtos';
import { UserRole } from '../../core/enums/user_role';

export class ListUserDto extends IntersectionType(
  PartialType(PaginationDto),
  PartialType(SortParamsDto),
) {
  @ApiProperty()
  @IsDefined()
  @IsIn([UserRole.Customer, UserRole.Employee])
  public role?: UserRole;
}
