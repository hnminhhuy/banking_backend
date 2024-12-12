import { forwardRef, Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, swaggerConfig, authConfig, constantConfig],
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
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {}
