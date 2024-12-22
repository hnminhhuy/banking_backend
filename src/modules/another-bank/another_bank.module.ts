import { forwardRef, Module } from '@nestjs/common';
import { AnotherBankService } from './infra/services/another_bank.service';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { BankAccountService } from './infra/services/bank_account.service';
import { IBankAccountRepo } from './core/repositories/bank_account.irepo';
import { BankAccountRepo } from './infra/repositories/bank_account.repo';
import { GetAnotherBankAccountInfoUsecase } from './core/usecases/bank_account/get_another_bank_user.usecase';
import { BankAccountController } from './app/controllers/bank_account.controller';
import { BankAccountModule } from '../bank_account/bank_account.module';

@Module({
  imports: [
    CacheModule.register(),
    HttpModule,
    forwardRef(() => BankAccountModule),
  ],
  controllers: [BankAccountController],
  providers: [
    {
      provide: IBankAccountRepo,
      useClass: BankAccountRepo,
    },
    AnotherBankService,
    BankAccountService,
    GetAnotherBankAccountInfoUsecase,
  ],
  exports: [GetAnotherBankAccountInfoUsecase],
})
export class AnotherBankModule {}
