import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserModel, UserModelParams } from '../../core/models/user.model';
import { Page, PageParams, SortParams } from 'src/common/models';
import { UserSort } from '../../core/enums/user_sort';
import { UserRole } from '../../core/enums/user_role';

@Injectable()
export class UserDatasource {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  public async create(user: UserModel): Promise<void> {
    console.log(user);
    const newUser = this.userRepo.create(user);
    await this.userRepo.insert(newUser);
  }

  public async getUserBy(
    key: string,
    value: unknown,
    relations: string[] | undefined = undefined,
  ): Promise<UserModel | undefined> {
    const query = this.userRepo.createQueryBuilder('users');

    query.where(`users.${key} = :value`, { value });

    if (relations) {
      relations.forEach((relation) => {
        query.leftJoinAndSelect(`users.${relation}`, relation);
      });
    }

    const entity = await query.getOne();
    if (entity) {
      return new UserModel(entity);
    } else {
      return undefined;
    }
  }

  public async update(
    id: string,
    updatedFields: Partial<UserModelParams>,
  ): Promise<boolean> {
    return (await this.userRepo.update(id, updatedFields)).affected > 0;
  }

  public async updatePassword(id: string, password: string): Promise<boolean> {
    const result = await this.userRepo.update(id, { password });
    return result.affected > 0;
  }

  public async list(
    role: UserRole,
    pageParams: PageParams,
    sortParams: SortParams<UserSort>,
    relations: string[] | undefined = undefined,
  ) {
    const condition: FindOptionsWhere<UserEntity> = {
      role: role,
    };
    const orderBy: Record<any, any> = {};

    let totalCount = 0;
    let users: UserEntity[] = [];

    if (sortParams) {
      orderBy[sortParams.sort] = sortParams.direction;
    }

    const query = this.userRepo.createQueryBuilder();

    query.setFindOptions({
      where: condition,
      relations: relations,
      skip: pageParams.limit * (pageParams.page - 1),
      take: pageParams.limit,
      order: orderBy,
    });

    if (pageParams.needTotalCount) {
      totalCount = await query.getCount();
    }

    if (!pageParams.onlyCount) {
      users = await query.getMany();
    }

    const userModels = users.map((user) => new UserModel(user));

    return new Page(pageParams.page, totalCount, userModels);
  }
}
