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
    private readonly bankCode: BankCode,
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

    if (externalBank.code === this.bankCode.EXTERNAL_BANK) {
      try {
        const res = await this.createExternalBankTransactionUsecase.execute(
          externalBank,
          transaction,
        );
        if (res.data) {
          await this.updateTransactionStatusUsecase.execute(
            id,
            TransactionStatus.SUCCESS,
          );
        } else {
          throw new Error('Failed to complete interbank transaction');
        }
      } catch (error) {
        throw new Error(`Interbank transaction failed: ${error.message}`);
      }
    } else {
      throw new BadRequestException('Invalid beneficiary bank ID');
    }
  }
}
