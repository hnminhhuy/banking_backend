import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/data/entities/user.entity';
import { IUserRepo } from './core/repositories/user.irepo';
import { UserRepo } from './infra/data/repositories/user.repo';
import { UserDataSource } from './infra/data/user.datasource';
import { CreateUserUsecase } from './core/usecases/users/create_user.usecase';
import { UserController } from './app/controller/user.controller';
import { AppModule } from 'src/app/app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AppModule),
  ],
  providers: [
    {
      provide: IUserRepo,
      useClass: UserRepo,
    },
    UserDataSource,
    CreateUserUsecase,
  ],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
