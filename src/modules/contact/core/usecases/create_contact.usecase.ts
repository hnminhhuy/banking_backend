import { Injectable } from '@nestjs/common';
import { IContactRepo } from '../repositories/contact.irepo';
import { ContactModel, ContactModelParams } from '../models/contact.model';
import { GetUserUsecase } from 'src/modules/user/core/usecases';
import { GetBankUsecase } from 'src/modules/bank/core/usecases';
import { GetBankAccountUsecase } from 'src/modules/bank_account/core/usecases';

@Injectable()
export class CreateContactUsecase {
  constructor(
    private readonly iContactRepo: IContactRepo,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly getBankUsecase: GetBankUsecase,
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
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
    if (bank.code !== 'NHB') throw new Error('ExternalBankError');

    const contactUser = await this.getBankAccountUsecase.execute(
      'id',
      params['beneficiaryId'],
      ['user'],
    );

    if (!contactUser) throw new Error('BankAccountNotFoundError');
    if (contactUser.userId === userId)
      throw new Error('BankAccountNotFoundError');

    params['userId'] = userId;
    params['beneficiaryName'] = contactUser.user.fullName;

    const newContact = new ContactModel(params as CreateContactParams);
    await this.iContactRepo.create(newContact);
    return newContact;
  }
}
