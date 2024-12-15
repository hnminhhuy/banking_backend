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
  GetUserUsecase,
  ListUserUsecase,
  UpdateUserPassword,
  UpdateUserUsecase,
} from './core/usecases';
import {
  UserControllerByAdmin,
  UserControllerByCustomer,
  UserControllerByEmployee,
} from './app/controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => BankAccountModule),
    forwardRef(() => BankModule),
  ],
  exports: [
    CreateUserUsecase,
    UpdateUserUsecase,
    GetUserUsecase,
    UpdateUserPassword,
    BlockUserUsecase,
    ListUserUsecase,
  ],
  providers: [
    {
      provide: IUserRepo,
      useClass: UserRepo,
    },
    UserDatasource,
    CreateUserUsecase,
    GetUserUsecase,
    UpdateUserUsecase,
    UpdateUserPassword,
    ListUserUsecase,
    BlockUserUsecase,
    GeneratePasswordUsecase,
  ],
  controllers: [
    UserControllerByAdmin,
    UserControllerByEmployee,
    UserControllerByCustomer,
  ],
})
export class UserModule {}
