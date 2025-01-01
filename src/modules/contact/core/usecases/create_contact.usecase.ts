import { BadRequestException, Injectable } from '@nestjs/common';
import { IContactRepo } from '../repositories/contact.irepo';
import { ContactModel, ContactModelParams } from '../models/contact.model';
import { GetUserUsecase } from 'src/modules/user/core/usecases';
import { GetBankUsecase } from 'src/modules/bank/core/usecases';
import { GetBankAccountUsecase } from 'src/modules/bank_account/core/usecases';
import { GetExternalBankAccountInfoUsecase } from '../../../external-bank/core/usecases/bank_account/get_external_bank_user.usecase';
import { BankCode } from '../../../bank/core/enums/bank_code';

@Injectable()
export class CreateContactUsecase {
  constructor(
    private readonly iContactRepo: IContactRepo,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly getBankUsecase: GetBankUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly bankCode: BankCode,
    private readonly getExternalBankAccountInfoUsecase: GetExternalBankAccountInfoUsecase,
  ) {}

  async execute(
    userId: string,
    params: ContactModelParams,
  ): Promise<ContactModel> {
    type CreateContactParams = Pick<
      ContactModelParams,
      'userId' | 'bankId' | 'beneficiaryId' | 'beneficiaryName' | 'updatedAt'
    >;
    const user = await this.getUserUsecase.execute('id', userId);
    if (!user) throw new Error('UserNotFoundError');

    const bank = await this.getBankUsecase.execute('id', params['bankId']);
    let contactUser = undefined;
    let beneficiaryName = undefined;
    switch (bank.code) {
      case this.bankCode.DEFAULT:
        contactUser = await this.getBankAccountUsecase.execute(
          'id',
          params['beneficiaryId'],
          ['user'],
        );
        beneficiaryName = contactUser.user.fullName;
        break;
      case this.bankCode.EXTERNAL_BANK:
        contactUser = await this.getExternalBankAccountInfoUsecase.execute(
          bank,
          params['beneficiaryId'],
        );
        beneficiaryName = contactUser.data.fullName;
        break;
      default:
        throw new BadRequestException('Bank ID not found');
    }

    if (!contactUser) throw new Error('BankAccountNotFoundError');
    if (contactUser.userId === userId)
      throw new Error('CannotCreateContactForSelfError');

    params['userId'] = userId;
    params['beneficiaryName'] = beneficiaryName;

    const newContact = new ContactModel(params as CreateContactParams);
    await this.iContactRepo.create(newContact);
    return newContact;
  }
}
