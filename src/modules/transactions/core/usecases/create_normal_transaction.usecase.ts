import { BadRequestException, Injectable } from '@nestjs/common';
import { GetBankAccountUsecase } from '../../../bank_account/core/usecases';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { GetExternalBankAccountInfoUsecase } from '../../../external-bank/core/usecases/bank_account/get_external_bank_user.usecase';
import { GetConfigUsecase } from '../../../bank_config/core/usecase';
import { CreateOtpUsecase } from '../../../otp/core/usecases';
import { CreateTransactionUsecase } from './create_transaction.usecase';
import { BankAccountModel } from '../../../bank_account/core/models/bank_account.model';
import { BankCode } from '../../../bank/core/enums/bank_code';
import { CreateTransactionDto } from '../../app/dtos';
import { ConfigKey } from '../../../bank_config/core/enum/config_key';
import {
  TransactionModel,
  TransactionModelParams,
} from '../models/transaction.model';
import { TransactionType } from '../enums/transaction_type';
import { OtpType } from '../../../otp/core/enums/otpType.enum';
import { throwError } from '../../../../common/helpers/throw_error';

@Injectable()
export class CreateNormalTransactionUsecase {
  private externalFee = 0;
  private internalFee = 0;

  constructor(
    private readonly getBankAccountUsecase: GetBankAccountUsecase,
    private readonly getBankUsecase: GetBankUsecase,
    private readonly getExternalBankAccountInfoUsecase: GetExternalBankAccountInfoUsecase,
    private readonly getConfigUsecase: GetConfigUsecase,
    private readonly createOtpUsecase: CreateOtpUsecase,
    private readonly createTransactionUsecase: CreateTransactionUsecase,
    private readonly bankCode: BankCode,
  ) {
    this.initializeConfigValues();
  }

  private async initializeConfigValues(): Promise<void> {
    try {
      const [externalConfig, internalConfig] = await Promise.all([
        this.getConfigUsecase.execute(ConfigKey.EXTERNAL_TRANSACTION_FEE),
        this.getConfigUsecase.execute(ConfigKey.INTERNAL_TRANSACTION_FEE),
      ]);
      this.externalFee = externalConfig.getValue();
      this.internalFee = internalConfig.getValue();
    } catch (error) {
      throwError(error.message);
    }
  }

  public async execute(
    remitter: BankAccountModel,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionModel> {
    if (remitter.balance < createTransactionDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }
    let beneficiary: any = undefined;

    const beneficiaryBank = await this.getBankUsecase.execute(
      'id',
      createTransactionDto.beneficiaryBankId,
    );

    if (!beneficiaryBank) {
      throw new BadRequestException(
        `Bank with ${createTransactionDto.beneficiaryBankId} not found`,
      );
    }

    let fee = undefined;

    switch (beneficiaryBank.code) {
      case this.bankCode.EXTERNAL_BANK:
        fee = this.externalFee;
        beneficiary = await this.getExternalBankAccountInfoUsecase.execute(
          createTransactionDto.beneficiaryId,
        );
        break;
      case this.bankCode.DEFAULT:
        fee = this.internalFee;
        beneficiary = await this.getBankAccountUsecase.execute(
          'id',
          createTransactionDto.beneficiaryId,
          ['user'],
        );
        break;
      default:
        throw new BadRequestException('Invalid beneficiary bank id');
    }

    const params: TransactionModelParams = {
      amount: createTransactionDto.amount,
      remitterId: createTransactionDto.remitterId,
      type: TransactionType.NORMAL,
      transactionFee: fee,
      beneficiaryId: createTransactionDto.beneficiaryId,
      beneficiaryBankId: createTransactionDto.beneficiaryBankId,
      remitterPaidFee: createTransactionDto.remitterPaidFee,
      message: createTransactionDto.message,
      beneficiaryName: beneficiary.user?.fullName ?? beneficiary?.data.fullName,
      remitterBankId: remitter.bankId,
      remitterName: remitter.user.fullName,
    };

    const transaction = await this.createTransactionUsecase.execute(params);

    await this.createOtpUsecase.execute(OtpType.TRANSACTION, remitter.userId, {
      transactionId: transaction.id,
    });

    return transaction;
  }
}
