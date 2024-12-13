import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/data/entities/user.entity';
import { IUserRepo } from './core/repositories/user.irepo';
import { UserRepo } from './infra/data/repositories/user.repo';
import { UserDatasource } from './infra/data/user.datasource';
import {
  CreateUserUsecase,
  GetUserUsecase,
  ListUserUsecase,
  UpdateUserPassword,
  UpdateUserUsecase,
} from './core/usecases';
import { UserControllerByAdmin } from './app/controller';
import { UserControllerByEmployee } from './app/controller/employee/employee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [
    CreateUserUsecase,
    UpdateUserUsecase,
    GetUserUsecase,
    UpdateUserPassword,
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
  ],
  controllers: [UserControllerByAdmin, UserControllerByEmployee],
})
export class UserModule {}
