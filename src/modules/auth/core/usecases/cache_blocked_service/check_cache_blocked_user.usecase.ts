import { Injectable } from '@nestjs/common';
import { CacheBlockedUserIRepo } from '../../repositories/cache_blocked_user.irepo';

@Injectable()
export class CheckCacheBlockedUserUsecase {
  constructor(private readonly cacheBlockedUserRepo: CacheBlockedUserIRepo) {}
  public async execute(userId: string): Promise<boolean> {
    return this.cacheBlockedUserRepo.isBlockedUser(userId);
  }
}
