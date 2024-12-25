import { Injectable } from '@nestjs/common';
import { IContactRepo } from '../repositories/contact.irepo';
import { ContactModelParams } from '../models/contact.model';
import { GetContactUsecase } from './get_contact.usecase';
import { filterAllowedFields } from 'src/common/helpers/filter_allowed_fields.helper';
import { GetBankAccountUsecase } from 'src/modules/bank_account/core/usecases';

@Injectable()
export class UpdateContactUsecase {
  private readonly allowedFieldsToUpdate = [
    'beneficiaryId',
    'beneficiaryName',
    'nickname',
  ];
  constructor(
    private readonly iContactRepo: IContactRepo,
    private readonly getContactUsecase: GetContactUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
  ) {}

  public async execute(
    userId: string,
    id: string,
    updatedFields: Partial<ContactModelParams>,
  ): Promise<boolean> {
    const existingContact = await this.getContactUsecase.execute(
      'id',
      id,
      undefined,
    );
    if (!existingContact) {
      throw new Error('NotFoundContactError');
    }

    if (existingContact.userId !== userId)
      throw new Error('ContactNotBelongToUser');

    if (updatedFields.beneficiaryId) {
      console.log('update', updatedFields.beneficiaryId);
      const contactUser = await this.getBankAccountUsecase.execute(
        'id',
        updatedFields.beneficiaryId,
        ['user'],
      );
      if (!contactUser) throw new Error('BankAccountNotFoundError');
      updatedFields.beneficiaryName = contactUser.user.fullName;
    }

    const filteredFields = filterAllowedFields(
      updatedFields,
      this.allowedFieldsToUpdate,
    );

    if (Object.keys(filteredFields).length === 0) {
      // throw new BadRequestException('No valid field to update');
      throw new Error('InvalidFirldError');
    }
    return this.iContactRepo.update(id, filteredFields);
  }
}
