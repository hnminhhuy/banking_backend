import { Injectable } from '@nestjs/common';
import { ICacheBlockedUserRepo } from '../../repositories/cache_blocked_user.irepo';

@Injectable()
export class UpdateCacheBlockedUserUsecase {
  constructor(private readonly cacheBlockedUserRepo: ICacheBlockedUserRepo) {}
  public async execute(userId: string, isBlocked: boolean): Promise<void> {
    await this.cacheBlockedUserRepo.updateCache(userId, isBlocked);
  }
}
