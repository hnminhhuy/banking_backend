import { Injectable } from '@nestjs/common';
import { ITransactionRepo } from '../repositories/transaction.irepo';
import { TransactionSort } from '../enums/transaction_sort';
import {
  DateFilter,
  Page,
  PageParams,
  SortParams,
} from '../../../../common/models';
import { TransactionModel } from '../models/transaction.model';
import { TransactionStatus } from '../enums/transaction_status';

@Injectable()
export class ListTransactionUsecase {
  constructor(private readonly transactionRepo: ITransactionRepo) {}

  public async execute(
    pageParams: PageParams,
    sortParams: SortParams<TransactionSort>,
    dateFilterParams: DateFilter | undefined,
    remitterId: string | undefined,
    beneficiaryId: string | undefined,
    bankId: string | undefined,
    status: TransactionStatus | undefined,
    relations: string[] | undefined = undefined,
  ): Promise<Page<TransactionModel>> {
    return await this.transactionRepo.list(
      pageParams,
      sortParams,
      dateFilterParams,
      remitterId,
      beneficiaryId,
      bankId,
      status,
      relations,
    );
  }
}
