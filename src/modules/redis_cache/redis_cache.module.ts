import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ICacheBlockedUserRepo } from './core/repositories/cache_blocked_user.irepo';
import { CacheBlockedUserRepo } from './infra/data/repositories/cache_blocked_user.repo';
import { CacheBlockedUserDatasource } from './infra/data/cache_blocked_user.datasource';
import {
  CheckCacheBlockedUserUsecase,
  GetOtpUsecase,
  SetCacheBlockedUserUsecase,
  SetOtpUsecase,
  UpdateCacheBlockedUserUsecase,
} from './core/usecases';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { IOtpRepo } from './core/repositories/otp.irepo';
import { OtpRepo } from './infra/data/repositories/otp.repo';
import { OtpDatasource } from './infra/data/otp.datasource';
import { BankConfigModule } from '../bank_config/bank_config.module';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => BankConfigModule)],
  controllers: [],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return new Redis(redisConfig);
      },
      inject: [ConfigService],
    },
    // Blocked user usecases
    {
      provide: ICacheBlockedUserRepo,
      useClass: CacheBlockedUserRepo,
    },
    CacheBlockedUserDatasource,
    SetCacheBlockedUserUsecase,
    UpdateCacheBlockedUserUsecase,
    CheckCacheBlockedUserUsecase,
    // OTP usecases
    {
      provide: IOtpRepo,
      useClass: OtpRepo,
    },
    OtpDatasource,
    SetOtpUsecase,
    GetOtpUsecase,
  ],
  exports: [
    'REDIS_CLIENT',
    SetCacheBlockedUserUsecase,
    UpdateCacheBlockedUserUsecase,
    CheckCacheBlockedUserUsecase,
    SetOtpUsecase,
    GetOtpUsecase,
  ],
})
export class RedisCacheModule {}
