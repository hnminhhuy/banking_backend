import { BankModel } from '../../../bank/core/models/bank.model';

export abstract class IBankAccountRepo {
  abstract get(externalBank: BankModel, id: string): Promise<any>;
}
