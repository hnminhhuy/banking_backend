import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/data/entities/user.entity';
import { IUserRepo } from './core/repositories/user.irepo';
import { UserRepo } from './infra/data/repositories/user.repo';
import { UserDatasource } from './infra/data/user.datasource';
import {
  BlockUserUsecase,
  CreateUserUsecase,
  GeneratePasswordUsecase,
  GetBlockedUserUsecase,
  GetUserUsecase,
  ListUserUsecase,
  UnblockUserUsecase,
  UpdateUserPasswordUsecase,
  UpdateUserUsecase,
} from './core/usecases';
import {
  UserControllerByAdmin,
  UserControllerByCustomer,
  UserControllerByEmployee,
} from './app/controller';
import { BankModule } from '../bank/bank.module';
import { BankAccountModule } from '../bank_account/bank_account.module';
import { MailModule } from '../mail/mail.module';
import { AppModule } from 'src/app/app.module';
import { RedisCacheModule } from '../redis_cache/redis_cache.module';
import { CreateAdminCommand } from './app/console/create_admin.command';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => RedisCacheModule),
    forwardRef(() => BankAccountModule),
    forwardRef(() => BankModule),
    forwardRef(() => MailModule),
    forwardRef(() => AppModule),
  ],
  providers: [
    CreateAdminCommand,
    {
      provide: IUserRepo,
      useClass: UserRepo,
    },
    UserDatasource,
    CreateUserUsecase,
    GetUserUsecase,
    UpdateUserUsecase,
    UpdateUserPasswordUsecase,
    ListUserUsecase,
    GetBlockedUserUsecase,
    GeneratePasswordUsecase,
    BlockUserUsecase,
    UnblockUserUsecase,
  ],
  exports: [
    CreateUserUsecase,
    UpdateUserUsecase,
    GetUserUsecase,
    ListUserUsecase,
    UpdateUserPasswordUsecase,
    GetBlockedUserUsecase,
    BlockUserUsecase,
    UnblockUserUsecase,
  ],
  controllers: [
    UserControllerByAdmin,
    UserControllerByEmployee,
    UserControllerByCustomer,
  ],
})
export class UserModule {}
