import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccountEntity } from './entities/bank_account.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BankAccountModel } from '../../core/models/bank_account.model';
import { Page, PageParams, SortParams } from '../../../../common/models';
import { BankAccountSort } from '../../core/enums/bank_account_sort';
import { paginate } from '../../../../common/helpers/pagination.helper';

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

  public async list(
    pageParams: PageParams,
    sortParams: SortParams<BankAccountSort> | undefined,
    relations: string[] | undefined = undefined,
  ): Promise<Page<BankAccountModel>> {
    const conditions: FindOptionsWhere<BankAccountEntity> = {};

    const { page, totalCount, rawItems } = await paginate<BankAccountEntity>(
      this.bankAccountRepo,
      pageParams,
      sortParams,
      relations,
      conditions,
    );
    const bankModels = rawItems.map((bank) => new BankAccountModel(bank));

    return new Page(page, totalCount, bankModels);
  }
}
