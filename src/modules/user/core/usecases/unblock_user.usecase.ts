import { HttpStatus, Injectable } from '@nestjs/common';
import { IUserRepo } from '../repositories/user.irepo';
import { BaseException } from 'src/exceptions';
import { ERROR_CODES } from 'src/common/utils/constants';
import { UpdateCacheBlockedUserUsecase } from 'src/modules/redis_cache/core/usecases';

@Injectable()
export class UnblockUserUsecase {
  constructor(
    private readonly userRepo: IUserRepo,
    private readonly updateCacheBlockedUserUsecase: UpdateCacheBlockedUserUsecase,
  ) {}

  public async execute(id: string): Promise<boolean> {
    try {
      const result = await this.userRepo.updateBlocked(id, false);
      if (!result) {
        throw new BaseException({
          code: ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: 'Failed to block user',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      // TODO: Update cache after blocked user in database.
      await this.updateCacheBlockedUserUsecase.execute(id, false);

      return result;
    } catch (error) {
      throw new BaseException({
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
