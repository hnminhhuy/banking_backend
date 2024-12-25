import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { BaseDto } from 'src/common/dtos';

export class ContactDto extends BaseDto {
  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  @IsUUID()
  bankId!: string;

  @ApiProperty()
  @IsString()
  beneficiaryId!: string;

  @ApiProperty()
  @IsString()
  beneficiaryName!: string;

  @ApiPropertyOptional()
  @IsString()
  nickname?: string;
}

export class CreateContactDto extends PickType(ContactDto, [
  'bankId',
  'beneficiaryId',
  'nickname',
]) {}

export class GetContactDto extends PickType(ContactDto, ['id']) {}
