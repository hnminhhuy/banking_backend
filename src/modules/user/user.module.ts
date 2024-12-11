import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/data/entities/user.entity';
import { IUserRepo } from './core/repositories/user.irepo';
import { UserRepo } from './infra/data/repositories/user.repo';
import { UserDatasource } from './infra/data/user.datasource';
import { CreateUserUsecase } from './core/usecases/create_user.usecase';
import { GetUserUsecase } from './core/usecases/get_user.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [CreateUserUsecase],
  providers: [
    {
      provide: IUserRepo,
      useClass: UserRepo,
    },
    UserDatasource,
    CreateUserUsecase,
    GetUserUsecase,
  ],
  controllers: [],
})
export class UserModule {}
