import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserModel } from '../../core/models/user.model';
import { validate as isUuid } from 'uuid';

@Injectable()
export class UserDatasource {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  public async create(user: UserModel): Promise<void> {
    const newUser = this.userRepo.create(user);
    await this.userRepo.insert(newUser);
  }

  public async getUserBy(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<UserModel | undefined> {
    const query = this.userRepo.createQueryBuilder('users');

    query.where(`users.${key} = :value`, { value });

    if (relations) {
      relations.forEach((relation) => {
        query.leftJoinAndSelect(`users.${relation}`, relation);
      });
    }

    const entity = await query.getOne();
    return new UserModel(entity);
  }
}
