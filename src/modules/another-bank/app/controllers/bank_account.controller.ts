import {
  BadRequestException,
  Body,
  Controller,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BankAccountByAnotherBank } from '../routes/bank_account.route';
import { GetBankAccountDto } from '../../../bank_account/app/dtos';
import { GetBankAccountUsecase } from '../../../bank_account/core/usecases';
import { Route } from '../../../../decorators';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Another Bank')
@Controller({ path: 'api/another-bank/v1/bank-accounts' })
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt_bank'))
export class BankAccountController {
  constructor(private readonly getBankAccountUsecase: GetBankAccountUsecase) {}

  @Route(BankAccountByAnotherBank.getBankAccount)
  async get(@Param() param: GetBankAccountDto) {
    const bankAccount = await this.getBankAccountUsecase.execute(
      'id',
      param.id,
      ['user'],
    );

    if (!bankAccount) {
      throw new BadRequestException(`Bank account with ${param.id} not found`);
    }

    return {
      id: bankAccount?.id,
      fullName: bankAccount?.user?.fullName,
    };
  }
}
