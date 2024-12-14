import { Injectable } from '@nestjs/common';
import { CacheBlockedUserDatasource } from '../data/cache_blocked_user.datasource';
import { CacheBlockedUserIRepo } from '../../core/repositories/cache_blocked_user.irepo';

@Injectable()
export class CacheBlockedUserRepo implements CacheBlockedUserIRepo {
  constructor(
    private readonly cacheBlockedUserDatasource: CacheBlockedUserDatasource,
  ) {}
  public async setCache(blockedUserIds: string[]): Promise<void> {
    this.cacheBlockedUserDatasource.setCache(blockedUserIds);
  }
  public async getCache(): Promise<string[]> {
    return this.cacheBlockedUserDatasource.getCache();
  }
  public isBlockedUser(userId: string): Promise<boolean> {
    return this.cacheBlockedUserDatasource.isBlockedUser(userId);
  }
  public async updateCache(userId: string, isBlocked: boolean): Promise<void> {
    this.cacheBlockedUserDatasource.updateCache(userId, isBlocked);
  }
}
