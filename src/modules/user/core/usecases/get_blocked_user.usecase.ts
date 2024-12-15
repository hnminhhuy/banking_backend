import { Injectable } from '@nestjs/common';
import { IUserRepo } from '../repositories/user.irepo';

@Injectable()
export class GetBlockedUserUsecase {
  constructor(private readonly userRepo: IUserRepo) {}

  public async execute(): Promise<string[]> {
    return this.userRepo.getBlockedUser();
  }
}
