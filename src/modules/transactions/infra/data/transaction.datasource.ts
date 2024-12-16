import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  TransactionModel,
  TransactionModelParams,
} from '../../core/models/transaction.model';
import { Page, PageParams, SortParams } from '../../../../common/models';
import { TransactionSort } from '../../core/enums/transaction_sort';
import { paginate } from '../../../../common/helpers/pagination.helper';
import { TransactionType } from '../../core/enums/transaction_type';
import { TransactionStatus } from '../../core/enums/transaction_status';

@Injectable()
export class TransactionDatasource {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  public async create(transaction: TransactionModel): Promise<void> {
    const newUser = this.transactionRepository.create(transaction);
    await this.transactionRepository.insert(newUser);
  }

  public async get(
    key: string,
    value: unknown,
    relations: string[] | undefined = undefined,
  ): Promise<TransactionModel | undefined> {
    const query = this.transactionRepository.createQueryBuilder('transactions');

    query.where(`transactions.${key} = :value`, { value });

    if (relations) {
      relations.forEach((relation) => {
        query.leftJoinAndSelect(`transactions.${relation}`, relation);
      });
    }

    const entity = await query.getOne();
    if (entity) {
      return new TransactionModel(entity);
    } else {
      return undefined;
    }
  }

  public async list(
    pageParams: PageParams,
    sortParams: SortParams<TransactionSort> | undefined,
    type: TransactionType | undefined,
    status: TransactionStatus | undefined,
    relations: string[] | undefined = undefined,
  ): Promise<Page<TransactionModel>> {
    const conditions: FindOptionsWhere<TransactionEntity> = {};

    if (type) {
      conditions['type'] = type;
    }

    if (status) {
      conditions['status'] = status;
    }

    const { page, totalCount, rawItems } = await paginate<TransactionEntity>(
      this.transactionRepository,
      pageParams,
      sortParams,
      relations,
      conditions,
    );

    const transactions = rawItems.map((bank) => new TransactionModel(bank));

    return new Page(page, totalCount, transactions);
  }

  public async update(
    id: string,
    updatedFields: Partial<TransactionModelParams>,
  ): Promise<boolean> {
    return (
      (await this.transactionRepository.update(id, updatedFields)).affected > 0
    );
  }
}
