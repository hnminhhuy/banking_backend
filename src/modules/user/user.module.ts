import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/data/entities/user.entity';
import { IUserRepo } from './core/repositories/user.irepo';
import { UserRepo } from './infra/data/repositories/user.repo';
import { UserDatasource } from './infra/data/user.datasource';
import {
  BlockUserUsecase,
  CreateUserUsecase,
  GetUserUsecase,
  ListUserUsecase,
  UpdateUserPassword,
  UpdateUserUsecase,
} from './core/usecases';
import {
  UserControllerByAdmin,
  UserControllerByEmployee,
} from './app/controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
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
  ],
  controllers: [UserControllerByAdmin, UserControllerByEmployee],
})
export class UserModule {}
