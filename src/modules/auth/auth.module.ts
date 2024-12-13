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
  CreateAccessTokenUsecase,
  CreateRefreshTokenUsecase,
  DeleteRefreshTokenUsecase,
  GetRefreshTokenUsecase,
  LoginUsecase,
  RefreshAccessTokenUsecase,
  VerifyTokenUsecase,
} from './core/usecases';

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
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    RoleAuthGuard,
    JwtUserStrategy,
    {
      provide: IRefreshTokenRepo,
      useClass: RefreshTokenRepo,
    },
    RefreshTokenDatasource,
    VerifyTokenUsecase,
    RefreshAccessTokenUsecase,
    CreateRefreshTokenUsecase,
    DeleteRefreshTokenUsecase,
    GetRefreshTokenUsecase,
    CreateAccessTokenUsecase,
    VerifyTokenUsecase,
    LoginUsecase,
  ],
})
export class AuthModule {}
