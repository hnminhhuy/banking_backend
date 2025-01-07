import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionStatus } from '../enums/transaction_status';
import { CreateExternalBankTransactionUsecase } from '../../../external-bank/core/usecases/transactions/create_external_bank_transaction.usecase';
import { BankCode } from '../../../bank/core/enums/bank_code';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { UpdateTransactionUsecase } from './update_transaction.usecase';

@Injectable()
export class ProcessInterBankTransactionUsecase {
  constructor(
    private readonly getBankUsecase: GetBankUsecase,
    private readonly createExternalBankTransactionUsecase: CreateExternalBankTransactionUsecase,
    private readonly updateTransactionStatusUsecase: UpdateTransactionUsecase,
  ) {}

  async execute(transaction: any): Promise<void> {
    const { id, beneficiaryBankId } = transaction;

    const externalBank = await this.getBankUsecase.execute(
      'id',
      beneficiaryBankId,
    );
    if (!externalBank) {
      throw new BadRequestException(
        `Bank with ID ${beneficiaryBankId} not found`,
      );
    }

    try {
      const res = await this.createExternalBankTransactionUsecase.execute(
        externalBank,
        transaction,
      );

      console.log(res);

      if (res.data) {
        await this.updateTransactionStatusUsecase.execute(
          id,
          TransactionStatus.SUCCESS,
        );
      } else {
        throw new Error('Failed to complete interbank transaction');
      }
    } catch (error) {
      console.log(error.response.data);
      throw new Error(`Interbank transaction failed: ${error.message}`);
    }
  }
}
