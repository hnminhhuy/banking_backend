import { Page, PageParams, SortParams } from 'src/common/models';
import { ContactModel, ContactModelParams } from '../models/contact.model';
import { ContactSort } from '../enums/contact_sort';
import { ContactUserModel } from '../models/contact_user.model';

export abstract class IContactRepo {
  public abstract create(contact: ContactModel): Promise<void>;
  public abstract getContact(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<ContactModel | undefined>;

  public abstract getAllContact(
    userId: string,
  ): Promise<ContactUserModel[] | undefined>;

  public abstract list(
    userId: string,
    pageParams: PageParams,
    sortParams: SortParams<ContactSort>,
    relations: string[] | undefined,
  ): Promise<Page<ContactModel>>;

  public abstract update(
    id: string,
    beneficiaryName: string | undefined,
    updatedFields: Partial<ContactModelParams>,
  ): Promise<boolean>;

  public abstract delete(id: string): Promise<boolean>;
}
