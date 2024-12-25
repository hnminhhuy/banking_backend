import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from './data/entities/contact.entity';
import { Repository } from 'typeorm';
import { ContactModel } from '../core/models/contact.model';

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
}
