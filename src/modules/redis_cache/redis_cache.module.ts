import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ICacheBlockedUserRepo } from './core/repositories/cache_blocked_user.irepo';
import { CacheBlockedUserRepo } from './infra/data/repositories/cache_blocked_user.repo';
import { CacheBlockedUserDatasource } from './infra/data/cache_blocked_user.datasource';
import {
  CheckCacheBlockedUserUsecase,
  SetCacheBlockedUserUsecase,
  UpdateCacheBlockedUserUsecase,
} from './core/usecases';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  imports: [forwardRef(() => UserModule)],
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
    {
      provide: 'CircularDependencyLog',
      useFactory: () => (msg: string) =>
        console.warn(`Circular dependency: ${msg}`),
    },
    {
      provide: ICacheBlockedUserRepo,
      useClass: CacheBlockedUserRepo,
    },
    CacheBlockedUserDatasource,
    SetCacheBlockedUserUsecase,
    UpdateCacheBlockedUserUsecase,
    CheckCacheBlockedUserUsecase,
  ],
  exports: [
    'REDIS_CLIENT',
    SetCacheBlockedUserUsecase,
    UpdateCacheBlockedUserUsecase,
    CheckCacheBlockedUserUsecase,
  ],
})
export class RedisCacheModule {}
