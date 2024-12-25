import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DebtEntity } from './data/entities/debt.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DebtModel, DebtModelParams } from '../core/models/debt.model';
import { Page, PageParams, SortParams } from 'src/common/models';
import { DebtSort } from '../core/enum/debt_sort';
import { paginate } from 'src/common/helpers/pagination.helper';
import { DebtStatus } from '../core/enum/debt_status';

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
