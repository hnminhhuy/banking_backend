import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankEntity } from './entities/bank.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BankModel } from '../../core/models/bank.model';
import { Page, PageParams, SortParams } from '../../../../common/models';
import { BankSort } from '../../core/enums/bank_sort';
import { paginate } from '../../../../common/helpers/pagination.helper';

@Injectable()
export class BankDatasource {
  constructor(
    @InjectRepository(BankEntity)
    private readonly bankRepo: Repository<BankEntity>,
  ) {}

  public async create(bank: BankModel): Promise<void> {
    const entity = this.bankRepo.create(bank);
    await this.bankRepo.insert(entity);
  }

  public async get(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<BankModel | undefined> {
    const query = this.bankRepo.createQueryBuilder('banks');

    query.where(`banks.${key} = :value`, { value });

    if (relations) {
      relations.forEach((relation) => {
        query.leftJoinAndSelect(`banks.${relation}`, relation);
      });
    }

    const entity = await query.getOne();
    return entity ? new BankModel(entity) : undefined;
  }

  public async list(
    pageParams: PageParams,
    sortParams: SortParams<BankSort> | undefined,
    relations: string[] | undefined = undefined,
  ): Promise<Page<BankModel>> {
    const conditions: FindOptionsWhere<BankEntity> = {};

    const { page, totalCount, rawItems } = await paginate<BankEntity>(
      this.bankRepo,
      pageParams,
      sortParams,
      relations,
      conditions,
    );

    const bankModels = rawItems?.map((bank) => new BankModel(bank));

    return new Page(page, totalCount, bankModels);
  }
}
