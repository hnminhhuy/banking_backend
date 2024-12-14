import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccountEntity } from './entities/bank_account.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BankAccountModel } from '../../core/models/bank_account.model';
import { Page, PageParams, SortParams } from '../../../../common/models';
import { BANK_ACCOUNT_SORT_KEY } from '../../core/enums/bank_account_sort_key';

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
    sortParams: SortParams<BANK_ACCOUNT_SORT_KEY> | undefined,
    relations: string[] | undefined = undefined,
  ): Promise<Page<BankAccountModel>> {
    const condition: FindOptionsWhere<BankAccountEntity> = {};
    const orderBy: Record<any, any> = {};

    if (sortParams) {
      orderBy[sortParams.sort] = sortParams.direction;
    }
    const query = this.bankAccountRepo.createQueryBuilder();

    query.setFindOptions({
      where: condition,
      relations: relations,
      skip: pageParams.limit * (pageParams.page - 1),
      take: pageParams.limit,
      order: orderBy,
    });

    let totalCount;
    if (pageParams.needTotalCount) {
      totalCount = await query.getCount();
    }

    let bankAccounts: BankAccountEntity[] = [];
    if (!pageParams.onlyCount) {
      bankAccounts = await query.getMany();
    }

    const bankModels = bankAccounts.map((bank) => new BankAccountModel(bank));

    return new Page(pageParams.page, totalCount, bankModels);
  }
}
