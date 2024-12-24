import {
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDebtUsecase } from '../../core/usecases';
import { Route } from 'src/decorators';
import { DebtRoute } from '../routes/debt.route';
import { CreateDebtDto } from '../dtos/debt.dto';
import { DebtModelParams } from '../../core/models/debt.model';
import { AuthGuard } from '@nestjs/passport';
import { GetBankAccountUsecase } from 'src/modules/bank_account/core/usecases';

@ApiTags('Debt by Customer')
@Controller({ path: 'api/customer/v1/debt' })
export class DebtController {
  constructor(private readonly createDebtUsecase: CreateDebtUsecase) {}
  @Route(DebtRoute.createDebt)
  @UseGuards(AuthGuard('jwt_user'))
  async createDebt(@Req() req, @Body() body: CreateDebtDto) {
    const debtParams: DebtModelParams = {
      debtorId: body.debtorId,
      amount: body.amount,
      message: body.message,
    };

    try {
      const data = await this.createDebtUsecase.execute(
        req.user.authId,
        debtParams,
      );

      if (!data) {
        throw new InternalServerErrorException('Failed to create debt record');
      }

      return {
        data: data,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      if (error.message === 'ReminderNotFoundError') {
        throw new NotFoundException('Reminder account not found');
      }
      if (error.message === 'DebtorNotFoundError') {
        throw new NotFoundException('Debtor account not found');
      }
      if (error.message === 'CannotCreateDebtForSelfError') {
        throw new InternalServerErrorException(
          'Cannot create debt for yourself',
        );
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
