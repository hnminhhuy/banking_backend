import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetBlockedUserUsecase } from 'src/modules/user/core/usecases';
import { ICacheBlockedUserRepo } from '../../repositories/cache_blocked_user.irepo';

@Injectable()
export class SetCacheBlockedUserUsecase {
  constructor(
    private readonly cacheBlockedUserRepo: ICacheBlockedUserRepo,

    @Inject(forwardRef(() => GetBlockedUserUsecase))
    private readonly getBlockedUserUsecase: GetBlockedUserUsecase,
  ) {}
  public async execute(): Promise<void> {
    const blockedUserIds = await this.getBlockedUserUsecase.execute();
    await this.cacheBlockedUserRepo.setCache(blockedUserIds);
  }
}
