import { Injectable } from '@nestjs/common';
import { IContactRepo } from '../repositories/contact.irepo';
import { ContactUserModel } from '../models/contact_user.model';

@Injectable()
export class GetAllContactInfoUsecase {
  constructor(private readonly iContactRepo: IContactRepo) {}

  public async execute(
    userId: string,
  ): Promise<ContactUserModel[] | undefined> {
    return this.iContactRepo.getAllContact(userId);
  }
}
