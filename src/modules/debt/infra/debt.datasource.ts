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
}
