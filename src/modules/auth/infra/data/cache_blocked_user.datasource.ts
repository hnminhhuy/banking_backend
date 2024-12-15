import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Redis } from 'ioredis'; // Import Redis from ioredis

@Injectable()
export class CacheBlockedUserDatasource {
  static CACHE_BLOCKED_USER_ID = 'blockedUserId';
  constructor(@Inject('REDIS_CLIENT') private redisClient: Redis) {}
  async setCache(blockedUserIds: string[]): Promise<void> {
    try {
      await this.redisClient.del(
        CacheBlockedUserDatasource.CACHE_BLOCKED_USER_ID,
      );
      if (blockedUserIds.length === 0) return;

      const result = await this.redisClient.sadd(
        CacheBlockedUserDatasource.CACHE_BLOCKED_USER_ID,
        ...blockedUserIds,
      );
      console.log('SADD result:', result);
    } catch (error) {
      console.error('Error in setCache:', error);
    }
  }
  async getCache(): Promise<string[]> {
    try {
      const blockedUsers = await this.redisClient.smembers(
        CacheBlockedUserDatasource.CACHE_BLOCKED_USER_ID,
      );
      return blockedUsers;
    } catch (error) {
      console.error('Error in getCache:', error);
      return []; // Return an empty array if there's an error
    }
  }
  async isBlockedUser(userId: string): Promise<boolean> {
    try {
      const isBlocked = await this.redisClient.sismember(
        CacheBlockedUserDatasource.CACHE_BLOCKED_USER_ID,
        userId,
      );
      return isBlocked === 1;
    } catch (error) {
      console.error('Error in isBlockedUser:', error);
      return false; // Assume not blocked if there's an error
    }
  }
  async updateCache(userId: string, isBlocked: boolean): Promise<void> {
    try {
      if (isBlocked) {
        // Add user to the blocked users set
        await this.redisClient.sadd(
          CacheBlockedUserDatasource.CACHE_BLOCKED_USER_ID,
          userId,
        );
        console.log(`User ${userId} has been blocked`);
      } else {
        // Remove user from the blocked users set
        await this.redisClient.srem(
          CacheBlockedUserDatasource.CACHE_BLOCKED_USER_ID,
          userId,
        );
        console.log(`User ${userId} has been unblocked`);
      }
    } catch (error) {
      console.error('Error in updateCache:', error);
    }
  }
}
