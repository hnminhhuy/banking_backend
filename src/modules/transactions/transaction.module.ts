import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './infra/data/entities/transaction.entity';
import { ITransactionRepo } from './core/repositories/transaction.irepo';
import { TransactionRepo } from './infra/data/repositories/transaction.repo';
import { TransactionDatasource } from './infra/data/transaction.datasource';
import {
  CreateTransactionUsecase,
  CreditBeneficiaryUsecase,
  GetTransactionUsecase,
  HandleTransactionFailureUsecase,
  ListTransactionUsecase,
  ProcessInterBankTransactionUsecase,
} from './core/usecases';
import { TransactionController as TransactionControllerByCustomer } from './app/controller/customer/transaction.controller';
import { AppModule } from '../../app/app.module';
import { BankAccountModule } from '../bank_account/bank_account.module';
import { BullModule } from '@nestjs/bullmq';
import { UpdateTransactionUsecase } from './core/usecases/update_transaction.usecase';
import { TransactionConsumer } from './app/consumer/transaction.consumer';
import { UserModule } from '../user/user.module';
import { BankConfigModule } from '../bank_config/bank_config.module';
import { OtpModule } from '../otp/otp.module';
import { TransactionController as TransactionControllerByEmployee } from './app/controller/employee/transaction.controller';
import { ExternalBankModule } from '../external-bank/external_bank.module';
import { BankModule } from '../bank/bank.module';
import { TransactionController as TransactionControllerByAdmin } from './app/controller/admin/transaction.controller';
import { DebtModule } from '../debt/debt.module';
import { CreateNormalTransactionUsecase } from './core/usecases/create_normal_transaction.usecase';
import { VerifyTransactionOtpUsecase } from './core/usecases/verify_transaction_otp.usecase';
import { CreateDebtTransactionUsecase } from './core/usecases/create_debt_transaction.usecase';
import { HandleTimeoutTransactionUsecase } from './core/usecases/handle_timeout_transaction.usecase';
import { UpdateTransactionsUsecase } from './core/usecases/update_transactions_status.usecase';
import { TransactionSchedule } from './app/schedules/transaction_schedule';
import { ScheduleModule } from '@nestjs/schedule';
import { StatisticTransactionUsecase } from './core/usecases/statistic_transaction.usecase';
import { NotificationModule } from '../notifications/notification.module';
import { GetCustomerDashboardTransactionUsecase } from './core/usecases/get_customer_dashboard_transaction.usecase';
import { TransactionGateway } from './infra/transaction_websocket';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    BullModule.registerQueue({
      name: 'transaction-queue',
    }),
    ScheduleModule.forRoot(),
    forwardRef(() => AppModule),
    forwardRef(() => BankAccountModule),
    forwardRef(() => UserModule),
    forwardRef(() => BankConfigModule),
    forwardRef(() => OtpModule),
    forwardRef(() => ExternalBankModule),
    forwardRef(() => BankModule),
    forwardRef(() => DebtModule),
    forwardRef(() => NotificationModule),
  ],
  controllers: [
    TransactionControllerByCustomer,
    TransactionControllerByEmployee,
    TransactionControllerByAdmin,
  ],
  providers: [
    TransactionSchedule,
    TransactionConsumer,
    {
      provide: ITransactionRepo,
      useClass: TransactionRepo,
    },
    TransactionGateway,
    TransactionDatasource,
    CreateTransactionUsecase,
    GetTransactionUsecase,
    UpdateTransactionUsecase,
    ListTransactionUsecase,
    CreateNormalTransactionUsecase,
    VerifyTransactionOtpUsecase,
    CreateDebtTransactionUsecase,
    CreditBeneficiaryUsecase,
    HandleTransactionFailureUsecase,
    ProcessInterBankTransactionUsecase,
    HandleTimeoutTransactionUsecase,
    UpdateTransactionsUsecase,
    StatisticTransactionUsecase,
    GetCustomerDashboardTransactionUsecase,
  ],
  exports: [
    TransactionGateway,
    CreateTransactionUsecase,
    GetTransactionUsecase,
    UpdateTransactionUsecase,
    CreateDebtTransactionUsecase,
    ListTransactionUsecase,
  ],
})
export class TransactionModule {}
