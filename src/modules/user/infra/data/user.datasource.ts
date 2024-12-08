import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserModel } from '../../core/models/user.model';

@Injectable()
export class UserDataSource {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async create(user: UserModel) {
    const newUser = this.userRepository.create(user);
    await this.userRepository.insert(newUser);
  }
}
