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
import { AuthModule } from 'src/modules/auth/auth.module';
import redisConfig from 'src/config/redis.config';
import { SetCacheBlockedUserUsecase } from 'src/modules/auth/core/usecases';
import Redis from 'ioredis';
import { BankConfigModule } from 'src/modules/bank_config/bank_config.module';

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
    forwardRef(() => UserModule),
    forwardRef(() => BankModule),
    forwardRef(() => BankAccountModule),
    forwardRef(() => MailModule),
    forwardRef(() => AuthModule),
    forwardRef(() => BankConfigModule),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return new Redis(redisConfig);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
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
