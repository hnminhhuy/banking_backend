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
import { TransactionModule } from '../modules/transactions/transaction.module';
import bullmqConfig from '../config/bullmq.config';
import { BullModule } from '@nestjs/bullmq';
import { BankConfigModule } from 'src/modules/bank_config/bank_config.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SetCacheBlockedUserUsecase } from 'src/modules/redis_cache/core/usecases';
import { RedisCacheModule } from 'src/modules/redis_cache/redis_cache.module';
import { ConsoleModule } from 'nestjs-console';
import appConfig from '../config/app.config';
import { ExternalBankModule } from '../modules/external-bank/external_bank.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import bankConfig from '../config/bank.config';
import { DebtModule } from 'src/modules/debt/debt.module';
import { ContactModule } from 'src/modules/contact/contact.module';
import externalBankConfig from '../config/external-bank.config';
import { NotificationModule } from '../modules/notifications/notification.module';

@Module({
  imports: [
    ConsoleModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        swaggerConfig,
        authConfig,
        constantConfig,
        mailConfig,
        redisConfig,
        bullmqConfig,
        appConfig,
        externalBankConfig,
        bankConfig,
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: configService.get('redis'),
      }),
    }),
    forwardRef(() => RedisCacheModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => BankModule),
    forwardRef(() => BankAccountModule),
    forwardRef(() => MailModule),
    forwardRef(() => AuthModule),
    forwardRef(() => TransactionModule),
    forwardRef(() => BankConfigModule),
    forwardRef(() => ExternalBankModule),
    forwardRef(() => OtpModule),
    forwardRef(() => DebtModule),
    forwardRef(() => ContactModule),
    forwardRef(() => NotificationModule),
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
