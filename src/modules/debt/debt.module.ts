import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtEntity } from './infra/data/entities/debt.entity';
import { BankAccountModule } from '../bank_account/bank_account.module';
import { DebtController } from './app/controller/debt.controller';
import { IDebtRepo } from './core/repositories/debt.irepo';
import { DebtRepo } from './infra/data/repositories/debt.repo';
import { CreateDebtUsecase } from './core/usecases';
import { DebtDatasource } from './infra/debt.datasource';
import { GetDebtUsecase } from './core/usecases/get_debt.usecase';
import { ListDebtUsecase } from './core/usecases/list_user.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtEntity]),
    forwardRef(() => BankAccountModule),
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
    ListDebtUsecase,
  ],
  exports: [],
})
export class DebtModule {}
