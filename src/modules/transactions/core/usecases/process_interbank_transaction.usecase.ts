import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionStatus } from '../enums/transaction_status';
import { CreateAnotherBankTransactionUsecase } from '../../../another-bank/core/usecases/transactions/create_another_bank_transaction.usecase';
import { BankCode } from '../../../bank/core/enums/bank_code';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { UpdateTransactionUsecase } from './update_transaction.usecase';

@Injectable()
export class ProcessInterBankTransactionUsecase {
  constructor(
    private readonly getBankUsecase: GetBankUsecase,
    private readonly createAnotherBankTransactionUsecase: CreateAnotherBankTransactionUsecase,
    private readonly updateTransactionStatusUsecase: UpdateTransactionUsecase,
    private readonly bankCode: BankCode,
  ) {}

  async execute(transaction: any): Promise<void> {
    const { id, beneficiaryBankId } = transaction;

    const anotherBank = await this.getBankUsecase.execute(
      'id',
      beneficiaryBankId,
    );
    if (!anotherBank) {
      throw new BadRequestException(
        `Bank with ID ${beneficiaryBankId} not found`,
      );
    }

    if (anotherBank.code === this.bankCode.ANOTHER_BANK) {
      try {
        const res =
          await this.createAnotherBankTransactionUsecase.execute(transaction);
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
