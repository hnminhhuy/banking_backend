import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import databaseConfig from 'src/config/database.config';
import swaggerConfig from 'src/config/swagger.config';
import authConfig from 'src/config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, swaggerConfig, authConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow<TypeOrmModuleAsyncOptions>(
          'database.postgres',
        ),
    }),
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {}
