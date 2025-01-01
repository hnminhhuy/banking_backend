import { Injectable, NotFoundException } from '@nestjs/common';
import { IContactRepo } from '../repositories/contact.irepo';
import { ContactModelParams } from '../models/contact.model';
import { GetContactUsecase } from './get_contact.usecase';
import { filterAllowedFields } from 'src/common/helpers/filter_allowed_fields.helper';
import { GetBankAccountUsecase } from 'src/modules/bank_account/core/usecases';
import { BankCode } from 'src/modules/bank/core/enums/bank_code';
import { GetExternalBankAccountInfoUsecase } from 'src/modules/external-bank/core/usecases/bank_account/get_external_bank_user.usecase';
import { GetBankUsecase } from 'src/modules/bank/core/usecases';

@Injectable()
export class UpdateContactUsecase {
  private readonly allowedFieldsToUpdate = ['beneficiaryId', 'nickname'];
  constructor(
    private readonly iContactRepo: IContactRepo,
    private readonly getContactUsecase: GetContactUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getExternalBankAccountInfoUsecase: GetExternalBankAccountInfoUsecase,
    private readonly bankCode: BankCode,
    private readonly getBankUsecase: GetBankUsecase,
  ) {}

  public async execute(
    code: string,
    userId: string,
    id: string,
    updatedFields: Partial<ContactModelParams>,
  ): Promise<boolean> {
    let beneficiaryName;
    let contactUser;
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

    const bank = await this.getBankUsecase.execute('code', code);

    if (!bank) {
      throw new NotFoundException('Invalid bank');
    }

    if (updatedFields.beneficiaryId) {
      switch (code) {
        case this.bankCode.DEFAULT:
          contactUser = await this.getBankAccountUsecase.execute(
            'id',
            updatedFields.beneficiaryId,
            ['user'],
          );
          if (!contactUser) throw new Error('BankAccountNotFoundError');
          beneficiaryName = contactUser.user.fullName;
          break;
        case this.bankCode.EXTERNAL_BANK:
          contactUser = await this.getExternalBankAccountInfoUsecase.execute(
            bank,
            updatedFields.beneficiaryId,
          );
          if (!contactUser) throw new Error('BankAccountNotFoundError');
          beneficiaryName = contactUser.data.fullName;
          break;
        default:
      }
    } else {
      delete updatedFields.beneficiaryId;
    }

    if (!updatedFields.nickname) delete updatedFields.nickname;

    const filteredFields = filterAllowedFields(
      updatedFields,
      this.allowedFieldsToUpdate,
    );

    if (Object.keys(filteredFields).length === 0) {
      // throw new BadRequestException('No valid field to update');
      throw new Error('InvalidFirldError');
    }
    filteredFields.bankId = bank.id;
    return this.iContactRepo.update(id, beneficiaryName, filteredFields);
  }
}
