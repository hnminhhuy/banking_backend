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
import { BankModel } from '../../../bank/core/models/bank.model';
import { TransactionCustomerChartMode } from '../../core/enums/transaction_customer_chart_mode';

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

    const transactions = items.map(
      (transaction) => new TransactionModel(transaction),
    );

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

  public async statistic(
    defaultBank: BankModel,
    externalBank: BankModel,
  ): Promise<any> {
    const result = await this.transactionRepository
      .createQueryBuilder('transactions')
      .select([
        `SUM(CASE 
         WHEN transactions.status = :status 
           AND transactions.remitterBankId = :defaultBankId 
           AND transactions.beneficiaryBankId = :externalBankId 
         THEN 
           CASE 
             WHEN transactions.remitterPaidFee 
             THEN transactions.transactionFee + transactions.amount 
             ELSE transactions.amount 
           END
         ELSE 0 END) as outcomingAmount`,
        `SUM(CASE 
         WHEN transactions.status = :status 
           AND transactions.remitterBankId = :externalBankId 
           AND transactions.beneficiaryBankId = :defaultBankId 
         THEN 
           CASE 
             WHEN transactions.remitterPaidFee 
             THEN transactions.amount 
             ELSE transactions.amount + transactions.transactionFee 
           END
         ELSE 0 END) as incomingAmount`,
        `COUNT(CASE 
         WHEN transactions.status = :status 
           AND (transactions.remitterBankId = :externalBankId OR transactions.beneficiaryBankId = :externalBankId) 
         THEN 1 ELSE NULL END) as transactionCount`,
      ])
      .setParameters({
        status: TransactionStatus.SUCCESS,
        defaultBankId: defaultBank.id,
        externalBankId: externalBank.id,
      })
      .getRawOne();

    return {
      outcomingAmount: parseInt(result.outcomingamount) ?? 0,
      incomingAmount: parseInt(result.incomingamount) ?? 0,
      transactionCount: parseInt(result.transactioncount) ?? 0,
    };
  }

  async getDashboardInfo(
    bankAccountId: string,
    mode: TransactionCustomerChartMode,
  ): Promise<Record<string, any>> {
    const groupByClause = `DATE_TRUNC('day', transactions.completedAt)`;

    const dateRange =
      mode === TransactionCustomerChartMode.Weekly
        ? `NOW() - INTERVAL '7 days'`
        : `NOW() - INTERVAL '30 days'`; // For monthly, limit to last 30 days

    // Build the query
    let query = this.transactionRepository
      .createQueryBuilder('transactions')
      .select([
        `${groupByClause}::date as time`, // Format as plain date
        'COUNT(transactions.id) as totalCount', // Total transactions
        `SUM(CASE WHEN transactions.remitterId = :bankAccountId THEN 1 ELSE 0 END) as remitterCount`, // Count remitter transactions
        `SUM(CASE WHEN transactions.beneficiaryId = :bankAccountId THEN 1 ELSE 0 END) as beneficiaryCount`, // Count beneficiary transactions
      ])
      .where(
        new Brackets((qb) => {
          qb.orWhere('transactions.remitterId = :bankAccountId', {
            bankAccountId,
          });
          qb.orWhere('transactions.beneficiaryId = :bankAccountId', {
            bankAccountId,
          });
        }),
      )
      .andWhere('transactions.status = :status', {
        status: TransactionStatus.SUCCESS,
      });

    // Apply date filter if necessary
    if (dateRange) {
      query.andWhere(`transactions.completedAt >= ${dateRange}`);
    }

    let result = await query
      .groupBy(groupByClause)
      .orderBy(groupByClause, 'ASC')
      .getRawMany();

    // Format the result for total transaction counts
    const formattedResult = result.map((item: any) => ({
      time: new Date(item.time).toLocaleDateString('vi'), // Formatted as YYYY-MM-DD
      value: parseInt(item.totalcount, 10),
      type: 'transaction',
    }));

    // Format the result for remitter transactions (Outcoming)
    const totalOutcoming = result.map((item: any) => ({
      time: new Date(item.time).toLocaleDateString('vi'), // Formatted as YYYY-MM-DD
      value: parseInt(item.remittercount, 10), // Remitter is Outcoming
      type: 'outcoming',
    }));

    // Format the result for beneficiary transactions (Incoming)
    const totalIncoming = result.map((item: any) => ({
      time: new Date(item.time).toLocaleDateString('vi'), // Formatted as YYYY-MM-DD
      value: parseInt(item.beneficiarycount, 10), // Beneficiary is Incoming
      type: 'incoming',
    }));

    return {
      totalTransactionData: formattedResult,
      byCategory: { totalIncoming, totalOutcoming },
    };
  }
}
