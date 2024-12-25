import { Injectable } from '@nestjs/common';
import { ContactModel } from 'src/modules/contact/core/models/contact.model';
import { IContactRepo } from 'src/modules/contact/core/repositories/contact.irepo';
import { ContactDatasource } from '../../contact.datasource';

@Injectable()
export class ContactRepo implements IContactRepo {
  constructor(private readonly contactDatasource: ContactDatasource) {}

  public async create(contact: ContactModel): Promise<void> {
    await this.contactDatasource.create(contact);
  }
}
