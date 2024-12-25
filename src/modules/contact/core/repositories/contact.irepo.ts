import { ContactModel } from '../models/contact.model';

export abstract class IContactRepo {
  public abstract create(contact: ContactModel): Promise<void>;
}
