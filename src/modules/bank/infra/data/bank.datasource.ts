import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankEntity } from './entities/bank.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BankModel } from '../../core/models/bank.model';
import { Page, PageParams, SortParams } from '../../../../common/models';
import { BANK_SORT_KEY } from '../../core/enums/bank_sort_key';

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
    sortParams: SortParams<BANK_SORT_KEY> | undefined,
    relations: string[] | undefined = undefined,
  ): Promise<Page<BankModel>> {
    const condition: FindOptionsWhere<BankEntity> = {};
    const orderBy: Record<any, any> = {};

    if (sortParams) {
      orderBy[sortParams.sort] = sortParams.direction;
    }
    const query = this.bankRepo.createQueryBuilder();

    query.setFindOptions({
      where: condition,
      relations: relations,
      skip: pageParams.limit * (pageParams.page - 1),
      take: pageParams.limit,
      order: orderBy,
    });

    let totalCount;
    if (pageParams.needTotalCount) {
      totalCount = await query.getCount();
    }

    let banks: BankEntity[] = [];
    if (!pageParams.onlyCount) {
      banks = await query.getMany();
    }

    const bankModels = banks.map((bank) => new BankModel(bank));

    return new Page(pageParams.page, totalCount, bankModels);
  }
}
