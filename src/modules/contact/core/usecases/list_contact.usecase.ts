import { Injectable } from '@nestjs/common';
import { IContactRepo } from '../repositories/contact.irepo';
import { PageParams, SortParams } from 'src/common/models';
import { ContactSort } from '../enums/contact_sort';

@Injectable()
export class ListContactUsecase {
  constructor(private readonly iContactRepo: IContactRepo) {}

  public async execute(
    userId: string,
    pageParams: PageParams,
    sortParams: SortParams<ContactSort>,
    relations: string[] | undefined = undefined,
  ) {
    return await this.iContactRepo.list(
      userId,
      pageParams,
      sortParams,
      relations,
    );
  }
}
