import { Module } from '@nestjs/common';
import { AnotherBankService } from './infra/services/another_bank.service';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CacheModule.register(), HttpModule],
  providers: [AnotherBankService],
})
export class AnotherBankModule {}
