import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DebtEntity } from './data/entities/debt.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DebtModel, DebtModelParams } from '../core/models/debt.model';
import { Page, PageParams, SortParams } from 'src/common/models';
import { DebtSort } from '../core/enum/debt_sort';
import { paginate } from 'src/common/helpers/pagination.helper';
import { DebtStatus } from '../core/enum/debt_status';
import { DebtorNameModel } from '../core/models/debtor_name.model';

@Injectable()
export class DebtDatasource {
  constructor(
    @InjectRepository(DebtEntity)
    private readonly debtRepository: Repository<DebtEntity>,
  ) {}

  public async create(debt: DebtModel): Promise<void> {
    const newDebt = this.debtRepository.create(debt);
    await this.debtRepository.insert(newDebt);
  }

  async getDebt(
    key: string,
    value: unknown,
    relations: string[] | undefined = undefined,
  ): Promise<DebtModel | undefined> {
    const query = this.debtRepository.createQueryBuilder('debts');

    query.where(`debts.${key} = :value`, { value });
    if (relations) {
      relations.forEach((relation) => {
        query.leftJoinAndSelect(`debts.${relation}`, relation);
      });
    }

    const entity = await query.getOne();
    if (entity) {
      return new DebtModel(entity);
    }
    return undefined;
  }

  async getDebtWithUser(id: string): Promise<DebtModel | undefined> {
    const result = await this.debtRepository.query(
      `
    SELECT 
      "debts"."id",
      "debts"."created_at", 
      "debts"."updated_at", 
      "debts"."reminder_id", 
      "debts"."debtor_id", 
      "debts"."amount", 
      "debts"."status", 
      "debts"."message", 
      "reminderUser"."fullname" AS "reminderFullName", 
      "debtorUser"."fullname" AS "debtorFullName"
    FROM "debts" "debts"
    LEFT JOIN "bank_accounts" "reminderAccount" ON "reminderAccount"."id"="debts"."reminder_id"
    LEFT JOIN "users" "reminderUser" ON "reminderUser"."id"="reminderAccount"."user_id"
    LEFT JOIN "bank_accounts" "debtorAccount" ON "debtorAccount"."id"="debts"."debtor_id"
    LEFT JOIN "users" "debtorUser" ON "debtorUser"."id"="debtorAccount"."user_id"
    WHERE "debts"."id" = $1;
  `,
      [id],
    );

    const entity = result[0];

    if (entity) {
      // Log the full entity for debugging
      console.log('Full entity:', entity);

      // Manually map the aliased fields to the DebtModel
      const debtModel = new DebtModel({
        id: entity.id,
        createdAt: entity.created_at,
        updatedAt: entity.updated_at,
        reminderId: entity.reminder_id,
        debtorId: entity.debtor_id,
        amount: entity.amount,
        status: entity.status,
        message: entity.message,
        reminderFullName: entity.reminderFullName, // Use the alias
        debtorFullName: entity.debtorFullName, // Use the alias
      });

      return debtModel;
    }

    return undefined;
  }

  async getAllDebtor(
    reminderId: string,
  ): Promise<DebtorNameModel[] | undefined> {
    const result = await this.debtRepository.query(
      `
    SELECT 
      "debts"."id",
      "debts"."created_at", 
      "debts"."updated_at", 
      "debts"."reminder_id", 
      "debts"."debtor_id", 
      "debts"."amount", 
      "debts"."status", 
      "debts"."message", 
      "reminderUser"."fullname" AS "reminderFullName", 
      "debtorUser"."fullname" AS "debtorFullName"
    FROM "debts" "debts"
    LEFT JOIN "bank_accounts" "reminderAccount" ON "reminderAccount"."id" = "debts"."reminder_id"
    LEFT JOIN "users" "reminderUser" ON "reminderUser"."id" = "reminderAccount"."user_id"
    LEFT JOIN "bank_accounts" "debtorAccount" ON "debtorAccount"."id" = "debts"."debtor_id"
    LEFT JOIN "users" "debtorUser" ON "debtorUser"."id" = "debtorAccount"."user_id"
    WHERE "debts"."reminder_id" = $1;
  `,
      [reminderId],
    );

    // Check if the result is empty
    if (result.length === 0) {
      console.log(`No debts found for reminderId: ${reminderId}`);
      return []; // Return an empty array if no debts are found
    }

    return result.map(
      (item) =>
        new DebtorNameModel({
          debtorId: item.debtor_id,
          debtorFullName: item.debtorFullName,
        }),
    );
  }

  async listDebtWithUser(
    conditions: Partial<DebtModelParams>,
    pageParams: PageParams,
    sortParams: SortParams<DebtSort>,
  ): Promise<Page<DebtModel>> {
    const whereConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(conditions)) {
      if (value !== undefined) {
        let normalizedKey = key;

        // Normalizing 'reminderId' to 'reminder_id'
        if (key === 'reminderId') {
          normalizedKey = 'reminder_id';
        }
        // Normalizing 'debtorId' to 'debtor_id'
        else if (key === 'debtorId') {
          normalizedKey = 'debtor_id';
        }
        whereConditions.push(
          `"debts"."${normalizedKey}" = $${queryParams.length + 1}`,
        );
        queryParams.push(value);
      }
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : 'WHERE 1=1';

    let orderByClause = `"debts"."created_at" DESC`;

    if (sortParams) {
      const sortField = sortParams.sort;
      const sortDirection = sortParams.direction === 'ASC' ? 'ASC' : 'DESC';

      // Apply sorting based on the sort field and direction
      if (sortField === DebtSort.CREATED_AT) {
        orderByClause = `"debts"."created_at" ${sortDirection}`;
      } else if (sortField === DebtSort.AMOUNT) {
        orderByClause = `"debts"."amount" ${sortDirection}`;
      }
    }

    // Main query to fetch debts with sorting
    const query = `
    SELECT 
      "debts"."id", 
      "debts"."created_at", 
      "debts"."updated_at", 
      "debts"."reminder_id", 
      "debts"."debtor_id", 
      "debts"."amount", 
      "debts"."status", 
      "debts"."message", 
      "reminderUser"."fullname" AS "reminderFullName", 
      "debtorUser"."fullname" AS "debtorFullName"
    FROM "debts" "debts"
    LEFT JOIN "bank_accounts" "reminderAccount" ON "reminderAccount"."id"="debts"."reminder_id"
    LEFT JOIN "users" "reminderUser" ON "reminderUser"."id"="reminderAccount"."user_id"
    LEFT JOIN "bank_accounts" "debtorAccount" ON "debtorAccount"."id"="debts"."debtor_id"
    LEFT JOIN "users" "debtorUser" ON "debtorUser"."id"="debtorAccount"."user_id"
    ${whereClause}
    ORDER BY ${orderByClause}
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
  `;

    queryParams.push(
      pageParams.limit,
      (pageParams.page - 1) * pageParams.limit,
    );

    const result = await this.debtRepository.query(query, queryParams);

    let totalCount = 0;
    if (pageParams.needTotalCount && !pageParams.onlyCount) {
      const countQuery = `
      SELECT COUNT(*)
      FROM "debts" "debts"
      LEFT JOIN "bank_accounts" "reminderAccount" ON "reminderAccount"."id"="debts"."reminder_id"
      LEFT JOIN "users" "reminderUser" ON "reminderUser"."id"="reminderAccount"."user_id"
      LEFT JOIN "bank_accounts" "debtorAccount" ON "debtorAccount"."id"="debts"."debtor_id"
      LEFT JOIN "users" "debtorUser" ON "debtorUser"."id"="debtorAccount"."user_id"
      ${whereClause}
    `;

      const countResult = await this.debtRepository.query(
        countQuery,
        queryParams.slice(0, 1),
      );
      totalCount = parseInt(countResult[0].count, 10);
    }

    const items = result.map(
      (item) =>
        new DebtModel({
          id: item.id,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          reminderId: item.reminder_id,
          debtorId: item.debtor_id,
          amount: item.amount,
          status: item.status,
          message: item.message,
          reminderFullName: item.reminderFullName,
          debtorFullName: item.debtorFullName,
        }),
    );

    return new Page(pageParams.page, totalCount, items);
  }

  async list(
    conditions: Partial<DebtModelParams>,
    pageParams: PageParams,
    sortParams: SortParams<DebtSort>,
    relations: string[] | undefined = undefined,
  ): Promise<Page<DebtModel>> {
    const queryConditions: FindOptionsWhere<DebtEntity> = {};

    for (const [key, value] of Object.entries(conditions)) {
      if (value !== undefined) {
        queryConditions[key as keyof DebtEntity] = value as any;
      }
    }

    const { page, totalCount, rawItems } = await paginate<DebtEntity>(
      this.debtRepository,
      pageParams,
      sortParams,
      relations,
      queryConditions,
    );
    const items = rawItems.map((item) => new DebtModel(item));

    return new Page(page, totalCount, items);
  }

  async cancelDebt(debtId: string): Promise<boolean> {
    const result = await this.debtRepository.update(debtId, {
      status: DebtStatus.Canceled,
    });

    return result.affected > 0;
  }
}
