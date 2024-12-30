import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import {
  Between,
  Brackets,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { TransactionModel } from '../../core/models/transaction.model';
import {
  DateFilter,
  Page,
  PageParams,
  SortParams,
} from '../../../../common/models';
import { TransactionSort } from '../../core/enums/transaction_sort';
import { TransactionStatus } from '../../core/enums/transaction_status';
import { TransactionType } from '../../core/enums/transaction_type';

@Injectable()
export class TransactionDatasource {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  public async create(transaction: TransactionModel): Promise<void> {
    const newTransaction = this.transactionRepository.create(transaction);
    await this.transactionRepository.insert(newTransaction);
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
    sortParams: SortParams<TransactionSort>,
    dateFilterParams: DateFilter | undefined,
    remitterId: string | undefined,
    beneficiaryId: string | undefined,
    bankId: string | undefined,
    statuses: TransactionStatus[] | undefined,
    type: TransactionType | undefined,
    relations: string[] | undefined = undefined,
  ): Promise<Page<TransactionModel>> {
    const conditions: FindOptionsWhere<TransactionEntity> = {};
    const orderBy: FindOptionsOrder<TransactionEntity> = {};
    if (dateFilterParams && dateFilterParams.column !== undefined) {
      if (dateFilterParams.from && dateFilterParams.to) {
        conditions[dateFilterParams.column as keyof TransactionEntity] = <any>(
          Between(dateFilterParams.from, dateFilterParams.to)
        );
      } else if (dateFilterParams.from) {
        conditions[dateFilterParams.column as keyof TransactionEntity] = <any>(
          MoreThanOrEqual(dateFilterParams.from)
        );
      } else if (dateFilterParams.to) {
        conditions[dateFilterParams.column as keyof TransactionEntity] = <any>(
          LessThanOrEqual(dateFilterParams.to)
        );
      }
    }

    if (statuses) {
      conditions['status'] = In(statuses);
    }

    if (sortParams) {
      orderBy[sortParams.sort] = sortParams.direction;
    }

    const query = this.transactionRepository.createQueryBuilder('transaction');
    if (type) {
      conditions['type'] = type;
    }

    if (remitterId || beneficiaryId) {
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

    if (bankId) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('transaction.beneficiaryBankId = :bankId', { remitterId });
          qb.orWhere('transaction.remitterBankId = :bankId', { bankId });
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
      completedAt:
        status === TransactionStatus.SUCCESS ||
        status === TransactionStatus.FAILED
          ? new Date().toUTCString()
          : undefined,
    });
    return result.affected > 0;
  }

  public async updateMany(
    ids: string[],
    status: TransactionStatus | undefined,
    completedAt: Date,
  ): Promise<void> {
    const data = {
      ...(status !== undefined && { status: status }),
    };
    if (Object.keys(data).length > 0) {
      await this.transactionRepository.update(
        { id: In(ids) },
        { ...data, completedAt: completedAt },
      );
    }
  }
}
