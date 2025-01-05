import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtEntity } from './infra/data/entities/debt.entity';
import { BankAccountModule } from '../bank_account/bank_account.module';
import { DebtController } from './app/controller/debt.controller';
import { IDebtRepo } from './core/repositories/debt.irepo';
import { DebtRepo } from './infra/data/repositories/debt.repo';
import { DebtDatasource } from './infra/debt.datasource';
import {
  CancelDebtUsecase,
  CreateDebtUsecase,
  GetDebtUsecase,
  ListDebtUsecase,
} from './core/usecases';
import { TransactionModule } from '../transactions/transaction.module';
import { BankConfigModule } from '../bank_config/bank_config.module';
import { OtpModule } from '../otp/otp.module';
import { UpdateDebtUsecase } from './core/usecases/update_debt.usecase';
import { GetDebtWithUserUsecase } from './core/usecases/get_debt_with_user.usecase';
import { ListDebtWithUserUsecase } from './core/usecases/list_debt_with_user.usecase';
import { GetAllDebtorUsecase } from './core/usecases/get_all_debto.usecase';
import { NotificationModule } from '../notifications/notification.module';
import { GetCustomerDashboardCountUsecase } from './core/usecases/get_customer_dashboard_count.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtEntity]),
    forwardRef(() => BankAccountModule),
    forwardRef(() => TransactionModule),
    forwardRef(() => BankConfigModule),
    forwardRef(() => OtpModule),
    forwardRef(() => NotificationModule),
  ],
  controllers: [DebtController],
  providers: [
    {
      provide: IDebtRepo,
      useClass: DebtRepo,
    },
    DebtDatasource,
    CreateDebtUsecase,
    GetDebtUsecase,
    GetDebtWithUserUsecase,
    GetAllDebtorUsecase,
    ListDebtUsecase,
    ListDebtWithUserUsecase,
    CancelDebtUsecase,
    UpdateDebtUsecase,
    GetCustomerDashboardCountUsecase,
  ],
  exports: [
    UpdateDebtUsecase,
    GetDebtUsecase,
    GetDebtWithUserUsecase,
    GetCustomerDashboardCountUsecase,
  ],
})
export class DebtModule {}
