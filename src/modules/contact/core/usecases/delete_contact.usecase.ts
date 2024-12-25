import { Injectable } from '@nestjs/common';
import { IContactRepo } from '../repositories/contact.irepo';
import { GetContactUsecase } from './get_contact.usecase';
import { GetBankAccountUsecase } from 'src/modules/bank_account/core/usecases';

@Injectable()
export class DeleteContactUsecase {
  constructor(
    private readonly iContactRepo: IContactRepo,
    private readonly getContactUsecase: GetContactUsecase,
  ) {}

  public async execute(userId: string, id: string): Promise<boolean> {
    const existingContact = await this.getContactUsecase.execute(
      'id',
      id,
      undefined,
    );
    console.log('id: ', id);
    if (!existingContact) {
      throw new Error('NotFoundContactError');
    }

    if (existingContact.userId !== userId)
      throw new Error('ContactNotBelongToUser');

    return this.iContactRepo.delete(id);
  }
}
