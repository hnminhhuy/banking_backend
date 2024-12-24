import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DebtEntity } from './data/entities/debt.entity';
import { Repository } from 'typeorm';
import { DebtModel } from '../core/models/debt.model';

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
}
