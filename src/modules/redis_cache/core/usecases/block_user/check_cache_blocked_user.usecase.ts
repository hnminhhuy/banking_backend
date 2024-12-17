import { Injectable } from '@nestjs/common';
import { ICacheBlockedUserRepo } from '../../repositories/cache_blocked_user.irepo';

@Injectable()
export class CheckCacheBlockedUserUsecase {
  constructor(private readonly cacheBlockedUserRepo: ICacheBlockedUserRepo) {}
  public async execute(userId: string): Promise<boolean> {
    return this.cacheBlockedUserRepo.isBlockedUser(userId);
  }
}
