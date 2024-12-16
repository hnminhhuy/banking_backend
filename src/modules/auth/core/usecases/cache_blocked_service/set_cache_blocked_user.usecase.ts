import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CacheBlockedUserIRepo } from '../../repositories/cache_blocked_user.irepo';
import { GetBlockedUserUsecase } from 'src/modules/user/core/usecases';

@Injectable()
export class SetCacheBlockedUserUsecase {
  constructor(
    private readonly cacheBlockedUserRepo: CacheBlockedUserIRepo,

    @Inject(forwardRef(() => GetBlockedUserUsecase))
    private readonly getBlockedUserUsecase: GetBlockedUserUsecase,
  ) {}
  public async execute(): Promise<void> {
    const blockedUserIds = await this.getBlockedUserUsecase.execute();
    await this.cacheBlockedUserRepo.setCache(blockedUserIds);
  }
}
