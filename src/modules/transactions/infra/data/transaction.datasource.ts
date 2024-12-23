import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import {
  Brackets,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { TransactionModel } from '../../core/models/transaction.model';
import { Page, PageParams, SortParams } from '../../../../common/models';
import { TransactionSort } from '../../core/enums/transaction_sort';
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
    remitterId: string | undefined,
    beneficiaryId: string | undefined,
    status: TransactionStatus | undefined,
    relations: string[] | undefined = undefined,
  ): Promise<Page<TransactionModel>> {
    const conditions: FindOptionsWhere<TransactionEntity> = {};
    const orderBy: FindOptionsOrder<TransactionEntity> = {};

    if (status) {
      conditions['status'] = status;
    }

    if (sortParams) {
      orderBy[sortParams.sort] = sortParams.direction;
    }
    const query = this.transactionRepository.createQueryBuilder('transaction');

    if (remitterId || beneficiaryId) {
      console.log('Ua do hong');
      query.andWhere(
        new Brackets((qb) => {
          if (remitterId) {
            qb.orWhere('transaction.remitterId = :remitterId', { remitterId });
          }
          if (beneficiaryId) {
            qb.orWhere(
              'transaction.beneficiaryId = :beneficiaryId AND transaction.status = :status',
              { beneficiaryId, status: TransactionStatus.SUCCESS },
            );
          }
        }),
      );
    }

    query.setFindOptions({
      where: conditions,
      relations: relations,
      skip: pageParams.limit * (pageParams.page - 1),
      take: pageParams.limit,
      order: orderBy,
    });

    let totalCount = 0;
    let items: TransactionEntity[] = [];
    if (pageParams.needTotalCount) {
      totalCount = await query.getCount();
    }

    if (!pageParams.onlyCount) {
      items = await query.getMany();
    }

    const transactions = items.map((bank) => new TransactionModel(bank));

    return new Page(pageParams.page, totalCount, transactions);
  }

  public async update(
    id: string,
    status: TransactionStatus | undefined,
  ): Promise<boolean> {
    const result = await this.transactionRepository.update(id, {
      status: status,
      updatedAt: new Date(),
    });
    return result.affected > 0;
  }
}
