import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccountEntity } from './entities/bank_account.entity';
import { Repository } from 'typeorm';
import { BankAccountModel } from '../../core/models/bank_account.model';

@Injectable()
export class BankAccountDatasource {
  constructor(
    @InjectRepository(BankAccountEntity)
    private readonly bankAccountRepo: Repository<BankAccountEntity>,
  ) {}

  public async create(bankAccount: BankAccountModel): Promise<void> {
    const newBankAccount = this.bankAccountRepo.create(bankAccount);
    await this.bankAccountRepo.insert(newBankAccount);
  }

  public async get(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<BankAccountModel | undefined> {
    const query = this.bankAccountRepo.createQueryBuilder('bank_accounts');

    query.where(`bank_accounts.${key} = :value`, { value });

    if (relations) {
      relations.forEach((relation) => {
        query.leftJoinAndSelect(`bank_accounts.${relation}`, relation);
      });
    }

    const entity = await query.getOne();
    return entity ? new BankAccountModel(entity) : undefined;
  }

  public async changeBalance(
    bankAccount: BankAccountModel,
    balance: number,
  ): Promise<boolean> {
    const result = await this.bankAccountRepo.update(bankAccount.id, {
      balance,
    });
    return result.affected > 0;
  }
}
