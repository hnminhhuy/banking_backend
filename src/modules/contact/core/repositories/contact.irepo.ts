import { Page, PageParams, SortParams } from 'src/common/models';
import { ContactModel } from '../models/contact.model';
import { ContactSort } from '../enums/contact_sort';

export abstract class IContactRepo {
  public abstract create(contact: ContactModel): Promise<void>;
  public abstract getContact(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<ContactModel | undefined>;

  public abstract list(
    userId: string,
    pageParams: PageParams,
    sortParams: SortParams<ContactSort>,
    relations: string[] | undefined,
  ): Promise<Page<ContactModel>>;
}
