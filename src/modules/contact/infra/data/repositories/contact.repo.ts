import { Injectable } from '@nestjs/common';
import { ContactModel } from 'src/modules/contact/core/models/contact.model';
import { IContactRepo } from 'src/modules/contact/core/repositories/contact.irepo';
import { ContactDatasource } from '../../contact.datasource';
import { PageParams, SortParams, Page } from 'src/common/models';
import { ContactSort } from 'src/modules/contact/core/enums/contact_sort';

@Injectable()
export class ContactRepo implements IContactRepo {
  constructor(private readonly contactDatasource: ContactDatasource) {}

  public async create(contact: ContactModel): Promise<void> {
    await this.contactDatasource.create(contact);
  }

  public async getContact(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<ContactModel | undefined> {
    return await this.contactDatasource.getContact(key, value, relations);
  }

  public async list(
    userId: string,
    pageParams: PageParams,
    sortParams: SortParams<ContactSort>,
    relations: string[] | undefined,
  ): Promise<Page<ContactModel>> {
    return await this.contactDatasource.list(
      userId,
      pageParams,
      sortParams,
      relations,
    );
  }
}
