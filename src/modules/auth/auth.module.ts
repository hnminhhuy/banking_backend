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
import { CreateRefreshTokenUsecase } from './core/usecases/refresh_tokens/create_refresh_token.usecase';
import { GetRefreshTokenUsecase } from './core/usecases/refresh_tokens/get_refresh_token.usecase';
import { CreateAccessTokenUsecase } from './core/usecases/auth_services/create_access_token.usecase';
import { VerifyTokenUsecase } from './core/usecases/auth_services/verify_token.usecase';
import { LoginUsecase } from './core/usecases/login.usecase';
import { RefreshAccessTokenUsecase } from './core/usecases/auth_services/refresh_access_token.usecase';
import { RoleAuthGuard } from './core/guards/role_auth.guard';
import { JwtUserStrategy } from './strategies/jwt_user.strategy';
import { DeleteRefreshTokenUsecase } from './core/usecases/refresh_tokens/delete_refresh_token.usecase';

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
