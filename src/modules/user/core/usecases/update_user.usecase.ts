import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepo } from '../repositories/user.irepo';
import { UserModelParams } from '../models/user.model';
import { filterAllowedFields } from 'src/common/helpers/filter_allowed_fields.helper';

@Injectable()
export class UpdateUserUsecase {
  private readonly allowedFieldsToUpdate = ['fullName', 'isBlocked'];
  constructor(private readonly userRepo: IUserRepo) {}

  public async execute(
    id: string,
    updatedFields: Partial<UserModelParams>,
  ): Promise<boolean> {
    const existingUser = await this.userRepo.getUserBy('id', id, undefined);
    if (!existingUser) {
      throw new NotFoundException(`User ${id} does not exist`);
    }

    const filteredFields = filterAllowedFields(
      updatedFields,
      this.allowedFieldsToUpdate,
    );

    if (Object.keys(filteredFields).length === 0) {
      throw new BadRequestException('No valid field to update');
    }
    return this.userRepo.update(id, filteredFields);
  }
}
