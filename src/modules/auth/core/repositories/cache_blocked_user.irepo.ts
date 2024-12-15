export abstract class CacheBlockedUserIRepo {
  public abstract setCache(blockedUserIds: string[]): Promise<void>;
  public abstract getCache(): Promise<string[]>;
  public abstract isBlockedUser(userId: string): Promise<boolean>;
  public abstract updateCache(
    userId: string,
    isBlocked: boolean,
  ): Promise<void>;
}
