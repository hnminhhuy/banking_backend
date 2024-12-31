import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from './data/entities/contact.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ContactModel, ContactModelParams } from '../core/models/contact.model';
import { Page, PageParams, SortParams } from 'src/common/models';
import { ContactSort } from '../core/enums/contact_sort';
import { paginate } from 'src/common/helpers/pagination.helper';
import { ContactUserModel } from '../core/models/contact_user.model';

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

  async getAllContact(userId: string): Promise<ContactUserModel[] | undefined> {
    const contacts = await this.contactRepository
      .createQueryBuilder('contacts')
      .leftJoinAndSelect('contacts.bank', 'bank') // Join the BankEntity
      .where('contacts.userId = :userId', { userId })
      .getMany();

    if (!contacts || contacts.length === 0) {
      return undefined;
    }

    console.log('contacts in datasource', contacts);

    // Mapping contacts to ContactUserModel
    return contacts.map((contact) => {
      return new ContactUserModel({
        beneficiaryId: contact.beneficiaryId,
        beneficiaryName: contact.beneficiaryName,
        nickname: contact.nickname,
        bankCode: contact.bank.code,
        bankName: contact.bank.name,
        bankShortName: contact.bank.shortName,
      });
    });
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
  async update(
    id: string,
    beneficiaryName: string | undefined,
    updatedFields: Partial<ContactModelParams>,
  ): Promise<boolean> {
    const updateData: Partial<ContactModelParams> = {
      ...updatedFields,
    };
    if (beneficiaryName) {
      updateData.beneficiaryName = beneficiaryName;
    }
    return (await this.contactRepository.update(id, updateData)).affected > 0;
  }

  async delete(id: string): Promise<boolean> {
    return (await this.contactRepository.delete(id)).affected > 0;
  }
}
