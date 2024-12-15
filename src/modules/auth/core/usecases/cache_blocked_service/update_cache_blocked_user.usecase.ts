import { Injectable } from '@nestjs/common';
import { CacheBlockedUserIRepo } from '../../repositories/cache_blocked_user.irepo';

@Injectable()
export class UpdateCacheBlockedUserUsecase {
  constructor(private readonly cacheBlockedUserRepo: CacheBlockedUserIRepo) {}
  public async execute(userId: string, isBlocked: boolean): Promise<void> {
    await this.cacheBlockedUserRepo.updateCache(userId, isBlocked);
  }
}
