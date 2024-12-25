import { forwardRef, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import databaseConfig from 'src/config/database.config';
import swaggerConfig from 'src/config/swagger.config';
import authConfig from 'src/config/auth.config';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { UserModule } from 'src/modules/user/user.module';
import { BankModule } from '../modules/bank/bank.module';
import { BankAccountModule } from '../modules/bank_account/bank_account.module';
import constantConfig from '../config/constant.config';
import mailConfig from '../config/mail_service.config';
import { MailModule } from '../modules/mail/mail.module';
import redisConfig from 'src/config/redis.config';
import { BankConfigModule } from 'src/modules/bank_config/bank_config.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SetCacheBlockedUserUsecase } from 'src/modules/redis_cache/core/usecases';
import { RedisCacheModule } from 'src/modules/redis_cache/redis_cache.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import { DebtModule } from 'src/modules/debt/debt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        swaggerConfig,
        authConfig,
        constantConfig,
        mailConfig,
        redisConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow<TypeOrmModuleAsyncOptions>(
          'database.postgres',
        ) as TypeOrmModuleOptions,
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Configuration options are required.');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    forwardRef(() => RedisCacheModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => BankModule),
    forwardRef(() => BankAccountModule),
    forwardRef(() => MailModule),
    forwardRef(() => BankConfigModule),
    forwardRef(() => OtpModule),
    forwardRef(() => DebtModule),
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly setCacheBlockedUserUsecase: SetCacheBlockedUserUsecase,
  ) {}

  async onModuleInit() {
    await this.setCacheBlockedUserUsecase.execute();
  }
}
// export class AppModule {}
