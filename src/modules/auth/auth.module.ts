import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './infra/data/entities/refresh_token.entity';
import authConfig from 'src/config/auth.config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './app/controller/auth.controller';
import { IRefreshTokenRepo } from './core/repositories/refresh_token.irepo';
import { RefreshTokenRepo } from './infra/repositories/refresh_token.repo';
import { RefreshTokenDatasource } from './infra/data/refresh_token.datasource';
import { RoleAuthGuard } from './core/guards/role_auth.guard';
import { JwtUserStrategy } from './strategies/jwt_user.strategy';
import {
  CheckCacheBlockedUserUsecase,
  CreateAccessTokenUsecase,
  CreateRefreshTokenUsecase,
  DeleteRefreshTokenUsecase,
  GetRefreshTokenUsecase,
  LoginUsecase,
  RefreshAccessTokenUsecase,
  SetCacheBlockedUserUsecase,
  UpdateCacheBlockedUserUsecase,
  VerifyTokenUsecase,
} from './core/usecases';
import { GetBlockedUserUsecase } from '../user/core/usecases/get_blocked_user.usecase';
import { CacheBlockedUserIRepo } from './core/repositories/cache_blocked_user.irepo';
import { CacheBlockedUserRepo } from './infra/repositories/cache_blocked_user.repo';
import { CacheBlockedUserDatasource } from './infra/data/cache_blocked_user.datasource';
import { AppModule } from 'src/app/app.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig],
    }),
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): any =>
        configService.get<JwtModuleOptions>('auth.jwt'),
    }),
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     const redisConfig = configService.get<CacheModuleAsyncOptions>('redis');

    //     return {
    //       ...redisConfig,
    //       store: redisStore,
    //     } as CacheModuleAsyncOptions;
    //   },
    // }),
    forwardRef(() => UserModule),
    forwardRef(() => AppModule),
  ],
  controllers: [AuthController],
  providers: [
    GetBlockedUserUsecase,
    RoleAuthGuard,
    JwtUserStrategy,
    CacheBlockedUserDatasource,
    {
      provide: IRefreshTokenRepo,
      useClass: RefreshTokenRepo,
    },
    {
      provide: CacheBlockedUserIRepo,
      useClass: CacheBlockedUserRepo,
    },
    RefreshTokenDatasource,
    VerifyTokenUsecase,
    RefreshAccessTokenUsecase,
    CreateRefreshTokenUsecase,
    DeleteRefreshTokenUsecase,
    GetRefreshTokenUsecase,
    CreateAccessTokenUsecase,
    LoginUsecase,
    SetCacheBlockedUserUsecase,
    CheckCacheBlockedUserUsecase,
    UpdateCacheBlockedUserUsecase,
  ],
  exports: [
    SetCacheBlockedUserUsecase,
    CheckCacheBlockedUserUsecase,
    UpdateCacheBlockedUserUsecase,
  ],
})
export class AuthModule {}
