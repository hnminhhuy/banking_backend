import { PickType } from '@nestjs/swagger';
import { DebtModel } from '../../core/models/debt.model';

export class CreateDebtReponseModel extends PickType(DebtModel, [
  'id',
  'debtorId',
  'amount',
  'message',
  'status',
  'reminderId',
]) {}
