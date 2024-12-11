import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankEntity } from './entities/bank.entity';
import { Repository } from 'typeorm';
import { BankModel } from '../../core/models/bank.model';

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
        query.leftJoinAndSelect(`users.${relation}`, relation);
      });
    }

    const entity = await query.getOne();
    return new BankModel(entity);
  }
}
