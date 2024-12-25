import { Injectable } from '@nestjs/common';
import { IContactRepo } from '../repositories/contact.irepo';
import { ContactModel } from '../models/contact.model';

@Injectable()
export class GetContactUsecase {
  constructor(private readonly iContactRepo: IContactRepo) {}

  public async execute(
    key: string,
    value: unknown,
    relations: string[] | undefined = undefined,
  ): Promise<ContactModel | undefined> {
    return this.iContactRepo.getContact(key, value, relations);
  }
}
