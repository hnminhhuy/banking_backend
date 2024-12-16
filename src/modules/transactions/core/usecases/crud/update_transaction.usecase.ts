import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ITransactionRepo } from '../../repositories/transaction.irepo';
import { TransactionModelParams } from '../../models/transaction.model';
import { filterAllowedFields } from '../../../../../common/helpers/filter_allowed_fields.helper';

@Injectable()
export class UpdateTransactionUsecase {
  private readonly allowedFieldsToUpdate = ['status'];

  constructor(private readonly transactionRepo: ITransactionRepo) {}

  public async execute(
    id: string,
    updatedFields: Partial<TransactionModelParams>,
  ): Promise<boolean> {
    const existingUser = await this.transactionRepo.get('id', id, undefined);
    if (!existingUser) {
      throw new NotFoundException(`Transaction ${id} does not exist`);
    }

    const filteredFields = filterAllowedFields(
      updatedFields,
      this.allowedFieldsToUpdate,
    );

    if (Object.keys(filteredFields).length === 0) {
      throw new BadRequestException('No valid field to update');
    }
    return this.transactionRepo.update(id, filteredFields);
  }
}
