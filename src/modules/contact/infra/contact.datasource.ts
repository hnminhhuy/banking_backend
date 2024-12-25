import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from './data/entities/contact.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ContactModel } from '../core/models/contact.model';
import { Page, PageParams, SortParams } from 'src/common/models';
import { ContactSort } from '../core/enums/contact_sort';
import { paginate } from 'src/common/helpers/pagination.helper';

@Injectable()
export class ContactDatasource {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) {}

  async create(contact: ContactModel): Promise<void> {
    const newContact = this.contactRepository.create(contact);
    await this.contactRepository.insert(newContact);
  }

  async getContact(
    key: string,
    value: unknown,
    relations: string[],
  ): Promise<ContactModel | undefined> {
    const query = this.contactRepository.createQueryBuilder('contacts');

    query.where(`contacts.${key} = :value`, { value });

    if (relations) {
      relations.forEach((relation) => {
        query.leftJoinAndSelect(`contacts.${relation}`, relation);
      });
    }

    const entity = await query.getOne();
    if (entity) return new ContactModel(entity);
    return undefined;
  }

  async list(
    userId: string,
    pageParams: PageParams,
    sortParams: SortParams<ContactSort>,
    relations: string[],
  ): Promise<Page<ContactModel>> {
    const conditions: FindOptionsWhere<ContactEntity> = {
      userId: userId,
    };

    const { page, totalCount, rawItems } = await paginate<ContactEntity>(
      this.contactRepository,
      pageParams,
      sortParams,
      relations,
      conditions,
    );

    const items = rawItems.map((item) => new ContactModel(item));

    return new Page(page, totalCount, items);
  }
}
